# CampusSync ER Diagram

```mermaid
erDiagram
    USERS {
        string id PK
        string name
        string email UK
        string password_hash
        string role "STUDENT|FACULTY|ADMIN"
        string department
        string external_id "studentId/facultyId/adminId"
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    RESOURCES {
        string id PK
        string name
        string type "CLASSROOM|LABORATORY|EQUIPMENT"
        string location
        int capacity
        boolean is_active
        json attributes_json
        datetime created_at
        datetime updated_at
    }

    BOOKINGS {
        string id PK
        string resource_id FK
        string requester_id FK
        datetime start_time
        datetime end_time
        string status "PENDING|APPROVED|REJECTED|CANCELLED"
        string purpose
        string slot_key "normalized lock key"
        int version
        datetime created_at
        datetime updated_at
    }

    APPROVALS {
        string id PK
        string booking_id FK
        string approver_id FK
        string status "PENDING|APPROVED|REJECTED"
        int level_order
        string comment
        datetime decided_at
        datetime created_at
    }

    NOTIFICATIONS {
        string id PK
        string user_id FK
        string booking_id FK
        string channel "EMAIL|IN_APP"
        string template_code
        string status "QUEUED|SENT|FAILED"
        datetime scheduled_at
        datetime sent_at
        int retry_count
        datetime created_at
    }

    AUDIT_LOGS {
        string id PK
        string actor_id FK
        string action
        string entity_type
        string entity_id
        json metadata_json
        string request_id
        datetime created_at
    }

    USERS ||--o{ BOOKINGS : "creates"
    RESOURCES ||--o{ BOOKINGS : "allocated_to"
    BOOKINGS ||--o{ APPROVALS : "has"
    USERS ||--o{ APPROVALS : "decides"
    USERS ||--o{ NOTIFICATIONS : "receives"
    BOOKINGS ||--o{ NOTIFICATIONS : "triggers"
    USERS ||--o{ AUDIT_LOGS : "acts_in"

    %% Logical constraints and indexing guidance
    %% PK: id on all collections
    %% FK: enforced in service layer + Prisma relations
    %% Indexes:
    %% 1) BOOKINGS(resource_id, start_time, end_time, status)
    %% 2) BOOKINGS(requester_id, created_at)
    %% 3) APPROVALS(booking_id, level_order, status)
    %% 4) NOTIFICATIONS(user_id, status, scheduled_at)
    %% 5) AUDIT_LOGS(entity_type, entity_id, created_at)
    %% Unique constraints:
    %% - USERS(email)
    %% - RESOURCES(name, location)
    %% - BOOKINGS(resource_id, slot_key, status_active_flag) to prevent double booking
```

## Constraints and Indexing Notes
- `USERS.email` must be unique.
- `BOOKINGS` must enforce `start_time < end_time`.
- Active overlap prevention:
  - App-level overlap query on `PENDING` and `APPROVED`.
  - Unique partial index idea: `(resource_id, slot_key)` where status in active states.
- Query-performance indexes:
  - `BOOKINGS(resource_id, start_time, end_time, status)`
  - `BOOKINGS(requester_id, created_at desc)`
  - `APPROVALS(booking_id, level_order)`
  - `AUDIT_LOGS(entity_type, entity_id, created_at desc)`
