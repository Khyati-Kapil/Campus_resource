# CampusSync ER Diagram

```mermaid
erDiagram
    USERS {
        string id PK "ObjectId"
        string name
        string email UK
        string passwordHash
        string role "STUDENT|FACULTY|ADMIN"
        string department "nullable"
        string externalId "nullable (studentId/facultyId/adminId)"
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }

    RESOURCES {
        string id PK "ObjectId"
        string name
        string type "CLASSROOM|LABORATORY|EQUIPMENT"
        string location
        int capacity
        boolean isActive
        json attributes "nullable (type-specific fields)"
        datetime createdAt
        datetime updatedAt
    }

    BOOKINGS {
        string id PK "ObjectId"
        string resourceId FK
        string requesterId FK
        datetime startTime
        datetime endTime
        string status "PENDING|APPROVED|REJECTED|CANCELLED"
        string purpose "nullable"
        string slotKey "resourceId:start:end"
        int version
        datetime createdAt
        datetime updatedAt
    }

    APPROVALS {
        string id PK "ObjectId"
        string bookingId FK
        string approverId FK
        string status "PENDING|APPROVED|REJECTED"
        int levelOrder
        string comment "nullable"
        datetime decidedAt "nullable"
        datetime createdAt
    }

    NOTIFICATIONS {
        string id PK "ObjectId"
        string userId FK
        string bookingId FK "nullable"
        string channel "EMAIL|IN_APP"
        string template
        string status "QUEUED|SENT|FAILED"
        datetime scheduledAt "nullable"
        datetime sentAt "nullable"
        int retryCount
        datetime createdAt
    }

    AUDITLOGS {
        string id PK "ObjectId"
        string actorId FK
        string action
        string entityType
        string entityId
        json metadata "nullable"
        string requestId "nullable"
        datetime createdAt
    }

    REFRESHTOKENS {
        string id PK "ObjectId"
        string userId FK
        string tokenHash UK
        datetime expiresAt
        datetime revokedAt "nullable"
        datetime createdAt
    }

    USERS ||--o{ BOOKINGS : requests
    RESOURCES ||--o{ BOOKINGS : reserved_for
    BOOKINGS ||--o{ APPROVALS : has
    USERS ||--o{ APPROVALS : decides
    USERS ||--o{ NOTIFICATIONS : receives
    BOOKINGS ||--o{ NOTIFICATIONS : triggers
    USERS ||--o{ AUDITLOGS : performs
    USERS ||--o{ REFRESHTOKENS : holds
```

## Constraints & Indexing (MongoDB + Prisma)
- Unique constraints:
  - `USERS.email`
  - `REFRESHTOKENS.tokenHash`
- High-impact indexes:
  - `BOOKINGS(resourceId, startTime, endTime, status)` for overlap detection
  - `BOOKINGS(requesterId, createdAt)` for user timelines
  - `APPROVALS(bookingId, levelOrder, status)` for workflow state
  - `NOTIFICATIONS(userId, status, scheduledAt)` for async dispatch
  - `AUDITLOGS(entityType, entityId, createdAt)` for governance queries
- Double-booking prevention:
  - Business-rule overlap query: `startTime < requestedEnd AND endTime > requestedStart` for active statuses (`PENDING`, `APPROVED`)
  - Concurrency protection: `slotKey` used as a lock key (application-level), plus optimistic `version` on updates

