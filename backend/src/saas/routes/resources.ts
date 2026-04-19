import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { ResourceModel } from "../models/Resource.js";
import { writeAuditLog } from "../services/auditService.js";

export const resourceRouter = Router();

resourceRouter.get("/", requireAuth, async (_req, res, next) => {
  try {
    const items = await ResourceModel.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: { items } });
  } catch (error) {
    next(error);
  }
});

resourceRouter.post("/", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const item = await ResourceModel.create(req.body);
    await writeAuditLog({
      actorId: req.user!.id,
      action: "RESOURCE_CREATED",
      entityType: "RESOURCE",
      entityId: item.id,
      metadata: { name: item.name, type: item.type }
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
});
