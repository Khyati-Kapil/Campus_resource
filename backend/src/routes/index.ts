import { Router } from "express";
import healthRoutes from "./health.routes.js";
import authRoutes from "./auth.routes.js";
import resourceRoutes from "./resource.routes.js";
import bookingRoutes from "./booking.routes.js";
import approvalRoutes from "./approval.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import notificationRoutes from "./notification.routes.js";
import auditRoutes from "./audit.routes.js";

const router = Router();

router.use(healthRoutes);
router.use("/auth", authRoutes);
router.use("/resources", resourceRoutes);
router.use("/bookings", bookingRoutes);
router.use("/approvals", approvalRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/notifications", notificationRoutes);
router.use("/audit-logs", auditRoutes);

export default router;
