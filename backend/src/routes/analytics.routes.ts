import { Router } from "express";
import { usageReport } from "../controllers/analytics.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";

const router = Router();

router.get("/usage", requireAuth, requireRole("ADMIN"), usageReport);

export default router;
