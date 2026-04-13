import { Router } from "express";
import { usageReport } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { usageQuerySchema } from "../models/dto/analytics.dto.js";

const router = Router();

router.get("/usage", requireAuth, requireRole("ADMIN"), validate(usageQuerySchema), usageReport);

export default router;
