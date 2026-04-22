import { Router } from "express";
import { cancelBooking, createBooking, listBookings } from "../controllers/booking.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { cancelBookingSchema, conflictCheckSchema, createBookingSchema, decisionSchema, listBookingsSchema } from "../models/dto/booking.dto.js";
import { ConflictDetectionService } from "../services/conflict-detection.service.js";
import { ApprovalService } from "../services/approval.service.js";
import { ok } from "../utils/api-response.js";

const router = Router();

router.get("/conflicts/check", requireAuth, validate(conflictCheckSchema), async (req, res, next) => {
  try {
    const resourceId = String(req.query.resourceId);
    const startTime = new Date(String(req.query.startTime));
    const endTime = new Date(String(req.query.endTime));

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || startTime >= endTime) {
      return res.status(400).json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid startTime/endTime" } });
    }

    const conflictService = new ConflictDetectionService();
    const conflict = await conflictService.checkConflict(resourceId, startTime, endTime);
    return res.json(ok({ conflict, message: conflict ? "Time slot already has a booking." : "Time slot is available." }));
  } catch (err) {
    next(err);
  }
});

router.get("/", requireAuth, validate(listBookingsSchema), listBookings);
router.post("/", requireAuth, validate(createBookingSchema), createBooking);
router.patch("/:id/cancel", requireAuth, validate(cancelBookingSchema), cancelBooking);

router.patch("/:bookingId/approve", requireAuth, requireRole("FACULTY", "ADMIN"), validate(decisionSchema), async (req, res, next) => {
  try {
    const service = new ApprovalService();
    const result = await service.approve(req.params.bookingId, req.user, req.body);
    return res.json(ok(result));
  } catch (err) {
    next(err);
  }
});

router.patch("/:bookingId/reject", requireAuth, requireRole("FACULTY", "ADMIN"), validate(decisionSchema), async (req, res, next) => {
  try {
    const service = new ApprovalService();
    const result = await service.reject(req.params.bookingId, req.user, req.body);
    return res.json(ok(result));
  } catch (err) {
    next(err);
  }
});

export default router;
