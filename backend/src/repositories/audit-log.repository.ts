import { prisma } from "../config/prisma.js";

export class AuditLogRepository {
  async create(data: { actorId: string; action: string; entityType: string; entityId: string; metadata?: Record<string, unknown> | null; requestId?: string | null }) {
    return prisma.auditLog.create({
      data: {
        actorId: data.actorId,
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        metadata: data.metadata ?? null,
        requestId: data.requestId ?? null
      }
    });
  }
}
