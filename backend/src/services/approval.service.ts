import { AppError } from "../utils/app-error.js";
import { eventBus } from "../events/event-bus.js";
import { BookingEvents } from "../events/booking.events.js";

export class ApprovalService {
  async approve(bookingId: string, user?: { id: string; role: string }, payload?: Record<string, unknown>) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Login required");
    }

    if (!bookingId) {
      throw new AppError(400, "VALIDATION_ERROR", "Booking id required");
    }

    const approval = {
      bookingId,
      approverId: user.id,
      status: "APPROVED",
      comment: payload?.comment ?? null
    };

    await eventBus.publish({
      type: BookingEvents.APPROVED,
      payload: approval,
      occurredAt: new Date()
    });

    return approval;
  }

  async reject(bookingId: string, user?: { id: string; role: string }, payload?: Record<string, unknown>) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Login required");
    }

    if (!bookingId) {
      throw new AppError(400, "VALIDATION_ERROR", "Booking id required");
    }

    const approval = {
      bookingId,
      approverId: user.id,
      status: "REJECTED",
      comment: payload?.comment ?? null
    };

    await eventBus.publish({
      type: BookingEvents.REJECTED,
      payload: approval,
      occurredAt: new Date()
    });

    return approval;
  }
}
