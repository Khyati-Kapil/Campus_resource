import { AppError } from "../utils/app-error.js";
import { eventBus } from "../events/event-bus.js";
import { BookingEvents } from "../events/booking.events.js";

export class BookingService {
  async create(payload: Record<string, unknown>, user?: { id: string; role: string }) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Login required");
    }

    if (!payload?.resourceId || !payload?.startTime || !payload?.endTime) {
      throw new AppError(400, "VALIDATION_ERROR", "Missing booking fields");
    }

    const booking = {
      id: "pending",
      resourceId: payload.resourceId,
      requesterId: user.id,
      status: "PENDING"
    };

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

    const booking = { id, status: "CANCELLED" };
    await eventBus.publish({
      type: BookingEvents.CANCELLED,
      payload: booking,
      occurredAt: new Date()
    });

    return booking;
  }
}
