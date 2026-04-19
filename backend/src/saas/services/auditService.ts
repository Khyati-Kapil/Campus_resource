import { AuditLogModel } from "../models/AuditLog.js";

export const writeAuditLog = async (data: {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
}) => {
  await AuditLogModel.create(data);
};
