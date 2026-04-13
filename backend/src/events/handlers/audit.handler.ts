import { DomainEvent } from "../event-bus.js";
import { AuditLogRepository } from "../../repositories/audit-log.repository.js";

const auditRepo = new AuditLogRepository();

export const auditHandler = async (event: DomainEvent) => {
  const payload = event.payload as { requesterId?: string; approverId?: string; booking?: { requesterId?: string; id?: string } };
  const actorId = payload.approverId ?? payload.requesterId ?? payload.booking?.requesterId;
  const entityId = payload.booking?.id ?? (event.payload as { id?: string }).id ?? "unknown";

  if (!actorId) return;

  await auditRepo.create({
    actorId,
    action: event.type,
    entityType: "BOOKING",
    entityId,
    metadata: event.payload
  });
};
