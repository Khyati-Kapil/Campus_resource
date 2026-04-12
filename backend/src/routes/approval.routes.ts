import { Router } from "express";
import { approveBooking, rejectBooking } from "../controllers/approval.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { decisionSchema } from "../models/dto/booking.dto.js";

const router = Router();

router.post("/:bookingId/approve", requireAuth, requireRole("FACULTY", "ADMIN"), validate(decisionSchema), approveBooking);
router.post("/:bookingId/reject", requireAuth, requireRole("FACULTY", "ADMIN"), validate(decisionSchema), rejectBooking);

export default router;
