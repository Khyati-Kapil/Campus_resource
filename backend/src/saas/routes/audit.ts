import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { AuditLogModel } from "../models/AuditLog.js";

export const auditRouter = Router();

auditRouter.get("/", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const query: Record<string, unknown> = {};
    if (req.query.entityType) query.entityType = req.query.entityType;
    if (req.query.entityId) query.entityId = req.query.entityId;

    const items = await AuditLogModel.find(query).sort({ createdAt: -1 }).limit(200);

    if (req.query.export === "csv") {
      const rows = ["timestamp,actorId,action,entityType,entityId"];
      for (const log of items) {
        rows.push(`${new Date(log.createdAt).toISOString()},${log.actorId},${log.action},${log.entityType},${log.entityId}`);
      }
      res.setHeader("Content-Type", "text/csv");
      return res.send(rows.join("\n"));
    }

    res.json({ success: true, data: { items } });
  } catch (error) {
    next(error);
  }
});
