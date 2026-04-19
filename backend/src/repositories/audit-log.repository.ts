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

  async list(filters: { entityType?: string; entityId?: string; skip?: number; take?: number }) {
    const where: Record<string, unknown> = {};
    if (filters.entityType) where.entityType = filters.entityType;
    if (filters.entityId) where.entityId = filters.entityId;

    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: filters.skip,
        take: filters.take
      }),
      prisma.auditLog.count({ where })
    ]);

    return { items, total };
  }
}
