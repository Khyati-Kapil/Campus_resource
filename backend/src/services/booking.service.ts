import { AppError } from "../utils/app-error.js";
import { eventBus } from "../events/event-bus.js";
import { BookingEvents } from "../events/booking.events.js";
import { BookingRepository } from "../repositories/booking.repository.js";
import { ConflictDetectionService } from "./conflict-detection.service.js";

const repo = new BookingRepository();
const conflictService = new ConflictDetectionService();

export class BookingService {
  async create(payload: Record<string, unknown>, user?: { id: string; role: string }) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Login required");
    }

    if (!payload?.resourceId || !payload?.startTime || !payload?.endTime) {
      throw new AppError(400, "VALIDATION_ERROR", "Missing booking fields");
    }

    const startTime = new Date(String(payload.startTime));
    const endTime = new Date(String(payload.endTime));

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      throw new AppError(400, "VALIDATION_ERROR", "Invalid start or end time");
    }

    if (startTime >= endTime) {
      throw new AppError(400, "VALIDATION_ERROR", "Start time must be before end time");
    }

    const hasConflict = await conflictService.checkConflict(String(payload.resourceId), startTime, endTime);
    if (hasConflict) {
      throw new AppError(409, "BOOKING_CONFLICT", "Requested slot overlaps an existing booking");
    }

    const booking = await repo.create({
      resourceId: String(payload.resourceId),
      requesterId: user.id,
      startTime,
      endTime,
      status: "PENDING"
    });

    await eventBus.publish({
      type: BookingEvents.CREATED,
      payload: booking,
      occurredAt: new Date()
    });

    return booking;
  }

  async cancel(id: string, user?: { id: string; role: string }) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Login required");
    }

    if (!id) {
      throw new AppError(400, "VALIDATION_ERROR", "Booking id required");
    }

    const existing = await repo.findById(id);
    if (!existing) {
      throw new AppError(404, "NOT_FOUND", "Booking not found");
    }

    if (existing.requesterId !== user.id && user.role !== "ADMIN") {
      throw new AppError(403, "FORBIDDEN", "Cannot cancel this booking");
    }

    const cancelled = await repo.cancel(id, "user_cancel", existing.version);

    await eventBus.publish({
      type: BookingEvents.CANCELLED,
      payload: cancelled,
      occurredAt: new Date()
    });

    return cancelled;
  }
}
