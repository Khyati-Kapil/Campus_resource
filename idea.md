# CampusSync - Smart Campus Resource Booking & Approval Platform

## Problem Statement
Colleges frequently manage classrooms, labs, seminar halls, and shared equipment through fragmented manual processes (emails, spreadsheets, ad hoc approvals). This causes double-bookings, missing approvals, low visibility, weak auditability, and poor utilization reporting.

## Solution Overview
CampusSync is a backend-focused full stack platform that centralizes campus resource booking with:
- JWT-based authentication and RBAC
- Conflict-aware booking engine
- Configurable approval workflows
- Event-driven processing for notifications/audits
- Analytics and operational observability

The design emphasizes reliability under concurrent access and traceable booking lifecycle transitions.

## Scope
### In Scope
- User and role management (Student, Faculty, Admin)
- Resource catalog and availability
- Booking request lifecycle management
- Conflict detection and concurrency-safe booking
- Approval workflow routing
- Notifications and reminders (async)
- Audit logs and analytics endpoints

### Out of Scope (Semester Boundary)
- Multi-tenant cross-institution hosting
- Billing/payment integrations
- Advanced ML forecasting
- Offline mobile app

## Key Features
- Register/login and secure token refresh flow
- Resource browsing with filters (type, capacity, building, equipment class)
- Booking requests with validation and conflict checks
- Approval routing: auto-approval and manual multi-step approval
- Lifecycle states: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`
- Notification dispatch (email + in-app strategy)
- Immutable audit trails for compliance
- Admin dashboards for utilization, rejection causes, peak slots

## System Architecture Overview
- Frontend: React + TypeScript (basic UI)
- Backend: Node.js + Express + TypeScript (clean layered architecture)
- Database: MongoDB with Prisma ORM
- Messaging: Internal domain event bus (expandable to Redis/RabbitMQ)
- API style: REST
- Auth: JWT access token + refresh token

Architecture style: Hybrid Clean Architecture + MVC + Services/Repositories.
- MVC at transport layer (`routes -> controllers`)
- Use-case logic in `services`
- Data access encapsulated by `repositories`

## High-Level Component Diagram Explanation
1. React client invokes REST endpoints via JWT.
2. Express routes pass through middleware (auth, validation, RBAC).
3. Controllers map DTOs to service calls.
4. Services enforce business rules, orchestration, and transaction boundaries.
5. Repositories isolate Prisma/Mongo access.
6. Domain events (`BOOKING_CREATED`, `BOOKING_APPROVED`, etc.) are published.
7. Notification and audit handlers consume events asynchronously.
8. Analytics service reads pre-aggregated metrics and transactional collections.

## Tech Stack Suggestion (MERN + TypeScript)
- MongoDB: primary datastore
- Express + Node.js + TypeScript: backend APIs and business logic
- React + TypeScript: operational UI
- Prisma: ORM/data mapper with type-safe queries
- Zod/Joi: schema validation
- Winston/Pino: structured logging
- BullMQ/Agenda (optional): robust async jobs for reminders

## Backend Architecture Explanation
Backend weightage (~75%) is enforced by a rich service layer:
- `AuthService`: token issuance, refresh, revocation, password hashing
- `BookingService`: create/cancel/state transitions, event emission
- `ConflictDetectionService`: overlap checks and resource-time exclusivity
- `ApprovalService`: workflow execution and decision transitions
- `NotificationService`: strategy-based dispatch and retry logic
- `AnalyticsService`: metrics aggregation and dashboard DTOs

Cross-cutting middlewares:
- `authMiddleware` (JWT verification)
- `rbacMiddleware` (role gates)
- `validationMiddleware` (DTO checks)
- `errorMiddleware` (uniform API error envelope)
- `requestContextMiddleware` (request id, user id for logs)

## Booking Conflict Detection Design
- Input: `resourceId`, `startTime`, `endTime`, requested status transition
- Rule: no overlap with active bookings (`PENDING` lock window, `APPROVED`)
- Overlap predicate:
  - conflict if `requestedStart < existingEnd` AND `requestedEnd > existingStart`
- Data safeguards:
  - composite index on `(resourceId, startTime, endTime, status)`
  - optimistic version on booking document
  - short-lived hold records for race-safe pending creation

Pseudo-flow:
1. Validate times and business constraints.
2. Acquire lock (resource+timeslot key, distributed when scaled).
3. Query repository for overlap.
4. If conflict -> reject with `409 CONFLICT`.
5. Else create booking in `PENDING`.
6. Release lock and emit `BOOKING_CREATED`.

## Approval Workflow Engine Design
Workflow configuration examples:
- Equipment below risk threshold -> `AutoApprovalStrategy`
- High-capacity hall or lab after-hours -> `ManualApprovalStrategy`

Engine flow:
1. Resolve applicable policy by resource type, requester role, and slot time.
2. Instantiate strategy via `ApprovalStrategyFactory`.
3. Execute rule set:
  - Auto: direct approve if constraints pass.
  - Manual: create approval tasks for designated approvers.
4. Persist decision and emit domain events.
5. Trigger notifications and audit logging.

## Event-Driven Booking Processing Explanation
Domain events decouple core booking actions from side effects:
- `BOOKING_CREATED`
- `BOOKING_APPROVED`
- `BOOKING_REJECTED`
- `BOOKING_CANCELLED`
- `BOOKING_REMINDER_DUE`

Consumers:
- Notification worker (email/in-app)
- Audit logger consumer
- Analytics projection updater

Benefits:
- Lower controller/service coupling
- Better resiliency (retry queues)
- Horizontal scalability for side-effect workloads

## Scalability Considerations
- Stateless API instances behind load balancer
- Redis-based distributed locking for resource-timeslot coordination
- Queue-backed notification processing
- Read-optimized analytics materialization
- Index optimization on bookings by resource and date range
- Pagination and filtering on all list endpoints

Semester-appropriate scale target:
- 10k users, 1k resources, 100k bookings/year with moderate burst traffic.

## Security Design
- JWT access token (short TTL) + refresh token rotation
- Password hashing (Argon2/Bcrypt)
- RBAC per route/action
- Input validation and sanitization to prevent injection-like payload abuse
- Rate limiting on auth endpoints
- Secure headers (Helmet), CORS allow-list
- Audit trail for sensitive operations (approval, cancellation, role change)

## Concurrency Handling Strategy
- Layer 1: Fast pre-check overlap query
- Layer 2: Resource-timeslot lock to serialize conflicting writes
- Layer 3: DB-level unique safeguard using normalized slot key for strict intervals
- Layer 4: Optimistic concurrency (`version` field) for update races

If two users submit same slot:
- first lock holder proceeds
- second receives `409` with conflicting booking reference

## Design Decisions Justification
- Express + TS: low setup friction, strong typing, ecosystem maturity
- Prisma + MongoDB: type-safe data access with flexible document modeling
- Strategy pattern for approvals/notifications: policy variability without service bloat
- Repository abstraction: testability and storage decoupling
- Event-driven side effects: keeps booking path deterministic and maintainable

## OOP Usage Explanation
### Encapsulation
- `BookingService` hides lifecycle transition rules (`canCancel`, `canApprove`)
- `ConflictDetectionService` encapsulates overlap algorithm and lock semantics

### Abstraction
- Interfaces (`BookingRepositoryInterface`, `ApprovalStrategy`, `NotificationStrategy`) define behavior contracts independent of implementation.

### Inheritance
- `Student`, `Faculty`, `Admin` extend base `User`
- `Classroom`, `Laboratory`, `Equipment` extend base `Resource`

### Polymorphism
- `ApprovalService` calls `ApprovalStrategy.execute()` regardless of concrete strategy
- `NotificationService` dispatches through `NotificationStrategy.send()`

## Design Patterns Used
- Repository: isolates persistence logic (`BookingRepository`, `ResourceRepository`)
- Strategy: pluggable approval and notification behavior
- Factory: `ApprovalStrategyFactory` resolves strategy from policy/context
- Singleton: centralized logger/event bus/config provider shared application-wide

## REST API Design Overview
Auth:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`

Resources:
- `GET /api/v1/resources`
- `POST /api/v1/resources` (Admin)
- `PATCH /api/v1/resources/:id` (Admin)

Bookings:
- `POST /api/v1/bookings`
- `GET /api/v1/bookings/:id`
- `GET /api/v1/bookings?status=&resourceId=&from=&to=`
- `PATCH /api/v1/bookings/:id/cancel`

Approvals:
- `POST /api/v1/approvals/:bookingId/approve`
- `POST /api/v1/approvals/:bookingId/reject`

Admin:
- `GET /api/v1/analytics/usage`
- `GET /api/v1/audit-logs`

Error envelope:
```json
{
  "success": false,
  "error": {
    "code": "BOOKING_CONFLICT",
    "message": "Requested slot overlaps an existing booking",
    "requestId": "req_123"
  }
}
```

## Folder Structure Recommendation
```text
src/
  controllers/
    auth.controller.ts
    booking.controller.ts
    approval.controller.ts
    resource.controller.ts
    analytics.controller.ts
  services/
    auth.service.ts
    booking.service.ts
    approval.service.ts
    notification.service.ts
    conflict-detection.service.ts
    analytics.service.ts
  repositories/
    user.repository.ts
    resource.repository.ts
    booking.repository.ts
    approval.repository.ts
    notification.repository.ts
    audit-log.repository.ts
  models/
    dto/
      create-booking.dto.ts
      approve-booking.dto.ts
    entities/
      user.entity.ts
      resource.entity.ts
      booking.entity.ts
  interfaces/
    booking-repository.interface.ts
    approval-strategy.interface.ts
    notification-strategy.interface.ts
  events/
    event-bus.ts
    booking.events.ts
    handlers/
      notification.handler.ts
      audit.handler.ts
      analytics.handler.ts
  routes/
    auth.routes.ts
    booking.routes.ts
    approval.routes.ts
    resource.routes.ts
    analytics.routes.ts
  middlewares/
    auth.middleware.ts
    rbac.middleware.ts
    validation.middleware.ts
    error.middleware.ts
    request-context.middleware.ts
  config/
    env.ts
    prisma.ts
    logger.ts
    jwt.ts
  utils/
    date-range.ts
    api-response.ts
    app-error.ts
app.ts
server.ts
```

## Recommended Git Commit Strategy
- `feat(auth): add JWT login and refresh endpoints`
- `feat(resources): implement CRUD with admin RBAC`
- `feat(booking): add conflict detection and booking lifecycle`
- `feat(approval): add strategy-based approval workflow`
- `feat(events): add async notifications and audit handlers`
- `feat(analytics): add utilization and trend APIs`
- `docs(architecture): add diagrams and design documentation`

Use small atomic commits, each with:
- controller + service + repository + tests for one feature slice
- migration/schema updates in same commit when required

## Future Enhancements
- Calendar sync (Google/Microsoft)
- QR-based check-in to release no-show bookings
- SLA/escalation rules for pending approvals
- Predictive slot recommendations from historical demand
- Multi-campus tenant segregation

