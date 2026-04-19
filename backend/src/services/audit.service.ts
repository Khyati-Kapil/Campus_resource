import { AuditLogRepository } from "../repositories/audit-log.repository.js";

export class AuditService {
  private repo: AuditLogRepository;

  constructor(repo?: AuditLogRepository) {
    this.repo = repo ?? new AuditLogRepository();
  }

  async list(query: { entityType?: string; entityId?: string; page?: number; pageSize?: number }) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const skip = (page - 1) * pageSize;

    const { items, total } = await this.repo.list({
      entityType: query.entityType,
      entityId: query.entityId,
      skip,
      take: pageSize
    });

    return { items, total, page, pageSize };
  }
}
