import { Request, Response } from "express";
import { AuditService } from "../services/audit.service.js";
import { ok } from "../utils/api-response.js";

const service = new AuditService();

export const listAuditLogs = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;
  const result = await service.list({
    entityType: req.query.entityType as string | undefined,
    entityId: req.query.entityId as string | undefined,
    page,
    pageSize
  });
  return res.json(ok(result));
};
