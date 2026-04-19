import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { BookingModel } from "../models/Booking.js";
import { hasConflict } from "../services/conflictService.js";
import { writeAuditLog } from "../services/auditService.js";
import { createNotifier } from "../services/notificationService.js";
import { Server } from "socket.io";

export const createBookingRouter = (io: Server) => {
  const router = Router();
  const notifier = createNotifier(io);

  router.get("/conflicts/check", requireAuth, async (req, res, next) => {
    try {
      const { resourceId, startTime, endTime } = req.query;
      if (!resourceId || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          error: { code: "INVALID_QUERY", message: "resourceId, startTime, and endTime are required" }
        });
      }

      const start = new Date(String(startTime));
      const end = new Date(String(endTime));
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return res.status(400).json({
          success: false,
          error: { code: "INVALID_QUERY", message: "Invalid date values" }
        });
      }
      if (start >= end) {
        return res.status(400).json({
          success: false,
          error: { code: "INVALID_SLOT", message: "Start must be before end" }
        });
      }

      const conflict = await hasConflict(String(resourceId), start, end);
      return res.json({
        success: true,
        data: { conflict, message: conflict ? "Time slot already has a booking." : "Time slot is available." }
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", requireAuth, async (req, res, next) => {
    try {
      const startTime = new Date(req.body.startTime);
      const endTime = new Date(req.body.endTime);
      if (startTime >= endTime) {
        return res.status(400).json({ success: false, error: { code: "INVALID_SLOT", message: "Start must be before end" } });
      }

      const conflict = await hasConflict(req.body.resourceId, startTime, endTime);
      if (conflict) {
        return res.status(409).json({ success: false, error: { code: "CONFLICT", message: "Resource already booked for this slot" } });
      }

      const booking = await BookingModel.create({
        resourceId: req.body.resourceId,
        requesterId: req.user!.id,
        startTime,
        endTime,
        purpose: req.body.purpose,
        status: "PENDING"
      });

      await writeAuditLog({
        actorId: req.user!.id,
        action: "BOOKING_CREATED",
        entityType: "BOOKING",
        entityId: booking.id,
        metadata: { resourceId: booking.resourceId }
      });

      await notifier.notify({
        userId: req.user!.id,
        type: "BOOKING_CREATED",
        message: "Your booking request was submitted.",
        meta: { bookingId: booking.id }
      });

      res.status(201).json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  });

  router.get("/", requireAuth, async (req, res, next) => {
    try {
      const query: Record<string, unknown> = {};
      if (req.query.status) query.status = req.query.status;
      if (req.query.resourceId) query.resourceId = req.query.resourceId;
      if (req.user!.role === "STUDENT") query.requesterId = req.user!.id;

      const items = await BookingModel.find(query).sort({ startTime: 1 });
      res.json({ success: true, data: { items } });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/cancel", requireAuth, async (req, res, next) => {
    try {
      const booking = await BookingModel.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Booking not found" } });
      }

      const ownsBooking = booking.requesterId.toString() === req.user!.id;
      if (!ownsBooking && req.user!.role !== "ADMIN") {
        return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Cannot cancel this booking" } });
      }

      booking.status = "CANCELLED";
      await booking.save();

      await writeAuditLog({
        actorId: req.user!.id,
        action: "BOOKING_CANCELLED",
        entityType: "BOOKING",
        entityId: booking.id
      });

      await notifier.notify({
        userId: booking.requesterId.toString(),
        type: "BOOKING_CANCELLED",
        message: "A booking was cancelled.",
        meta: { bookingId: booking.id }
      });

      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/approve", requireAuth, requireRole("ADMIN", "FACULTY"), async (req, res, next) => {
    try {
      const booking = await BookingModel.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Booking not found" } });
      }

      booking.status = "APPROVED";
      booking.approvalReason = req.body.reason ?? "Approved";
      await booking.save();

      await writeAuditLog({
        actorId: req.user!.id,
        action: "BOOKING_APPROVED",
        entityType: "BOOKING",
        entityId: booking.id,
        metadata: { reason: booking.approvalReason }
      });

      await notifier.notify({
        userId: booking.requesterId.toString(),
        type: "BOOKING_APPROVED",
        message: "Your booking has been approved.",
        meta: { bookingId: booking.id }
      });

      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id/reject", requireAuth, requireRole("ADMIN", "FACULTY"), async (req, res, next) => {
    try {
      const booking = await BookingModel.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: "Booking not found" } });
      }

      booking.status = "REJECTED";
      booking.approvalReason = req.body.reason ?? "Rejected";
      await booking.save();

      await writeAuditLog({
        actorId: req.user!.id,
        action: "BOOKING_REJECTED",
        entityType: "BOOKING",
        entityId: booking.id,
        metadata: { reason: booking.approvalReason }
      });

      await notifier.notify({
        userId: booking.requesterId.toString(),
        type: "BOOKING_REJECTED",
        message: "Your booking has been rejected.",
        meta: { bookingId: booking.id }
      });

      res.json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  });

  return router;
};
