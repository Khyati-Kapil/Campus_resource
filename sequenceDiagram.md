# CampusSync Sequence Diagrams

## A. Booking Request -> Conflict Check -> Approval -> Notification
```mermaid
sequenceDiagram
    autonumber
    participant U as Student/Faculty
    participant API as BookingController
    participant VM as ValidationMiddleware
    participant AS as Auth/RBAC Middleware
    participant BS as BookingService
    participant CDS as ConflictDetectionService
    participant BR as BookingRepository
    participant APS as ApprovalService
    participant AR as ApprovalRepository
    participant EB as EventBus
    participant NH as NotificationHandler (Async Worker)
    participant NS as NotificationService
    participant NR as NotificationRepository
    participant AL as AuditLogHandler
    participant ARP as AuditLogRepository

    U->>API: POST /bookings (resourceId, startTime, endTime)
    API->>VM: validate DTO
    alt invalid payload
        VM-->>API: ValidationError(400)
        API-->>U: 400 Bad Request
    else valid payload
        API->>AS: verify JWT + RBAC
        alt unauthorized/forbidden
            AS-->>API: AuthError(401/403)
            API-->>U: 401/403 response
        else authorized
            API->>BS: createBooking(dto, user)
            BS->>CDS: checkConflict(resourceId, slot)
            CDS->>BR: findOverlappingBookings(resourceId, slot, statuses)
            BR-->>CDS: overlap list
            alt conflict found
                CDS-->>BS: ConflictDetected
                BS-->>API: AppError(409 BOOKING_CONFLICT)
                API-->>U: 409 Conflict
            else no conflict
                BS->>BR: create(status=PENDING)
                BR-->>BS: booking
                BS->>APS: executeWorkflow(booking)
                APS->>AR: createApprovalTaskOrDecision()
                AR-->>APS: approval record
                APS-->>BS: decision(PENDING/APPROVED/REJECTED)
                BS->>BR: updateBookingStatus(decision)
                BS->>EB: publish(BOOKING_CREATED/STATUS_CHANGED)
                BS-->>API: booking response DTO
                API-->>U: 201 Created
                par async notifications
                    EB-->>NH: booking event
                    NH->>NS: send(notificationPayload)
                    NS->>NR: persistNotification()
                    NR-->>NS: saved
                and async audit
                    EB-->>AL: booking event
                    AL->>ARP: createAuditLog(event)
                    ARP-->>AL: saved
                end
            end
        end
    end
```

## B. Approval Workflow Execution Flow
```mermaid
sequenceDiagram
    autonumber
    participant A as Approver(Admin/Faculty)
    participant AC as ApprovalController
    participant VM as ValidationMiddleware
    participant AS as Auth/RBAC Middleware
    participant APS as ApprovalService
    participant ASF as ApprovalStrategyFactory
    participant ASTR as ApprovalStrategy
    participant BR as BookingRepository
    participant AR as ApprovalRepository
    participant EB as EventBus

    A->>AC: POST /approvals/{bookingId}/approve or reject
    AC->>VM: validate params/body
    alt validation failure
        VM-->>AC: 400 error
        AC-->>A: 400 Bad Request
    else valid
        AC->>AS: verify approver permissions
        alt not allowed
            AS-->>AC: 403 Forbidden
            AC-->>A: 403 Forbidden
        else allowed
            AC->>APS: processDecision(bookingId, action, actor)
            APS->>BR: findById(bookingId)
            BR-->>APS: booking
            alt booking not pending
                APS-->>AC: 409 InvalidState
                AC-->>A: 409 Conflict
            else pending
                APS->>ASF: resolveStrategy(booking, policy)
                ASF-->>APS: concrete strategy instance
                APS->>ASTR: execute(booking, action, actor)
                ASTR-->>APS: decisionResult
                APS->>AR: updateApprovalRecord(decisionResult)
                APS->>BR: updateBookingStatus(APPROVED/REJECTED)
                APS->>EB: publish(BOOKING_APPROVED/BOOKING_REJECTED)
                APS-->>AC: decision response
                AC-->>A: 200 OK
            end
        end
    end
```

## C. Authentication Flow
```mermaid
sequenceDiagram
    autonumber
    participant U as User
    participant AuthC as AuthController
    participant VM as ValidationMiddleware
    participant AuthS as AuthService
    participant UR as UserRepository
    participant JWT as JwtProvider
    participant RR as RefreshTokenRepository

    U->>AuthC: POST /auth/login (email,password)
    AuthC->>VM: validate login DTO
    alt invalid body
        VM-->>AuthC: 400
        AuthC-->>U: 400 Bad Request
    else valid
        AuthC->>AuthS: login(credentials)
        AuthS->>UR: findByEmail(email)
        UR-->>AuthS: user/null
        alt user missing or password mismatch
            AuthS-->>AuthC: AuthError(401)
            AuthC-->>U: 401 Unauthorized
        else authenticated
            AuthS->>JWT: generateAccessToken(userClaims)
            AuthS->>JWT: generateRefreshToken(userClaims)
            AuthS->>RR: saveRefreshToken(hash, userId, expiry)
            RR-->>AuthS: persisted
            AuthS-->>AuthC: tokens + profile
            AuthC-->>U: 200 OK
        end
    end
```

## D. Validation & Error Handling Flow
```mermaid
sequenceDiagram
    autonumber
    participant C as Client
    participant R as Route
    participant V as ValidationMiddleware
    participant CT as Controller
    participant S as Service
    participant Repo as Repository
    participant EH as ErrorMiddleware
    participant L as Logger

    C->>R: HTTP Request
    R->>V: validate schema
    alt schema invalid
        V->>EH: throw ValidationError
        EH->>L: log(error, requestId, userId?)
        EH-->>C: 400 + standardized error envelope
    else schema valid
        R->>CT: invoke controller
        CT->>S: business operation
        S->>Repo: persistence/query
        alt repository throws (db/network)
            Repo-->>S: error
            S->>EH: throw InternalAppError
            EH->>L: log stack + metadata
            EH-->>C: 500 Internal Server Error
        else domain rule fails
            S->>EH: throw AppError (409/422/404)
            EH->>L: warn with domain code
            EH-->>C: mapped business error response
        else success
            Repo-->>S: data
            S-->>CT: result DTO
            CT-->>C: 2xx success
        end
    end
```

## E. Concurrency-Safe Booking (Two Users Same Slot)
```mermaid
sequenceDiagram
    autonumber
    participant U1 as User A
    participant U2 as User B
    participant API as BookingController
    participant BS as BookingService
    participant LM as LockManager (Redis/Distributed)
    participant CDS as ConflictDetectionService
    participant BR as BookingRepository
    participant DB as MongoDB

    U1->>API: POST /bookings (R1, 10:00-11:00)
    U2->>API: POST /bookings (R1, 10:00-11:00)

    API->>BS: createBooking(request A)
    BS->>LM: acquireLock(resource:R1:10:00-11:00)
    LM-->>BS: lock granted
    BS->>CDS: checkConflict(R1,slot)
    CDS->>BR: findOverlappingBookings(...)
    BR->>DB: query overlap
    DB-->>BR: none
    BR-->>CDS: none
    BS->>BR: create booking A (PENDING)
    BR->>DB: insert A
    DB-->>BR: success
    BS->>LM: releaseLock(key)
    BS-->>API: 201 Created (A)
    API-->>U1: success

    API->>BS: createBooking(request B)
    BS->>LM: acquireLock(resource:R1:10:00-11:00)
    LM-->>BS: lock granted
    BS->>CDS: checkConflict(R1,slot)
    CDS->>BR: findOverlappingBookings(...)
    BR->>DB: query overlap
    DB-->>BR: booking A exists
    BR-->>CDS: overlap found
    CDS-->>BS: conflict
    BS->>LM: releaseLock(key)
    BS-->>API: AppError 409 BOOKING_CONFLICT
    API-->>U2: 409 Conflict
```
