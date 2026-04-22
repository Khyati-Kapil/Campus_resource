import { Router } from "express";
import { dbHealthCheck, healthCheck } from "../controllers/health.controller.js";

const router = Router();

router.get("/health", healthCheck);
router.get("/health/db", dbHealthCheck);

export default router;
