import { AppError } from "../utils/app-error.js";
import { eventBus } from "../events/event-bus.js";
import { BookingEvents } from "../events/booking.events.js";
import { ApprovalRepository } from "../repositories/approval.repository.js";
import { BookingRepository } from "../repositories/booking.repository.js";

export class ApprovalService {
  private approvalRepo: ApprovalRepository;
  private bookingRepo: BookingRepository;

  constructor(deps?: { approvalRepo?: ApprovalRepository; bookingRepo?: BookingRepository }) {
    this.approvalRepo = deps?.approvalRepo ?? new ApprovalRepository();
    this.bookingRepo = deps?.bookingRepo ?? new BookingRepository();
  }

  async approve(bookingId: string, user?: { id: string; role: string }, payload?: Record<string, unknown>) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Login required");
    }

    if (!bookingId) {
      throw new AppError(400, "VALIDATION_ERROR", "Booking id required");
    }

    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new AppError(404, "NOT_FOUND", "Booking not found");
    }

    if (booking.status !== "PENDING") {
      throw new AppError(409, "INVALID_STATE", "Booking is not pending");
    }

    const approval = await this.approvalRepo.create({
      bookingId,
      approverId: user.id,
      status: "APPROVED",
      comment: payload?.comment ? String(payload.comment) : payload?.reason ? String(payload.reason) : null
    });

    const updated = await this.bookingRepo.updateStatus(bookingId, "APPROVED", booking.version);

    await eventBus.publish({
      type: BookingEvents.APPROVED,
      payload: { ...approval, booking: updated },
      occurredAt: new Date()
    });

    return { approval, booking: updated };
  }

  async reject(bookingId: string, user?: { id: string; role: string }, payload?: Record<string, unknown>) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Login required");
    }

    if (!bookingId) {
      throw new AppError(400, "VALIDATION_ERROR", "Booking id required");
    }

    const booking = await this.bookingRepo.findById(bookingId);
    if (!booking) {
      throw new AppError(404, "NOT_FOUND", "Booking not found");
    }

    if (booking.status !== "PENDING") {
      throw new AppError(409, "INVALID_STATE", "Booking is not pending");
    }

    const approval = await this.approvalRepo.create({
      bookingId,
      approverId: user.id,
      status: "REJECTED",
      comment: payload?.comment ? String(payload.comment) : payload?.reason ? String(payload.reason) : null
    });

    const updated = await this.bookingRepo.updateStatus(bookingId, "REJECTED", booking.version);

    await eventBus.publish({
      type: BookingEvents.REJECTED,
      payload: { ...approval, booking: updated },
      occurredAt: new Date()
    });

    return { approval, booking: updated };
  }
}
