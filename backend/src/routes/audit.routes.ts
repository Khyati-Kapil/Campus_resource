import { Router } from "express";
import { listAuditLogs } from "../controllers/audit.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { listAuditLogsSchema } from "../models/dto/audit.dto.js";

const router = Router();

router.get("/", requireAuth, requireRole("ADMIN"), validate(listAuditLogsSchema), listAuditLogs);

export default router;
