import { DomainEvent } from "../event-bus.js";
import { NotificationRepository } from "../../repositories/notification.repository.js";
import { BookingRepository } from "../../repositories/booking.repository.js";

const notificationRepo = new NotificationRepository();
const bookingRepo = new BookingRepository();

export const notificationHandler = async (event: DomainEvent) => {
  if (event.type === "BOOKING_CREATED") {
    const payload = event.payload as { requesterId?: string; id?: string };
    if (payload.requesterId) {
      await notificationRepo.create({
        userId: payload.requesterId,
        bookingId: payload.id ?? null,
        channel: "IN_APP",
        template: "BOOKING_CREATED"
      });
    }
    return;
  }

  if (event.type === "BOOKING_CANCELLED") {
    const payload = event.payload as { requesterId?: string; id?: string };
    if (payload.requesterId) {
      await notificationRepo.create({
        userId: payload.requesterId,
        bookingId: payload.id ?? null,
        channel: "IN_APP",
        template: "BOOKING_CANCELLED"
      });
    }
    return;
  }

  if (event.type === "BOOKING_APPROVED" || event.type === "BOOKING_REJECTED") {
    const payload = event.payload as { booking?: { id?: string } };
    const bookingId = payload.booking?.id;
    if (!bookingId) return;

    const booking = await bookingRepo.findById(bookingId);
    if (!booking) return;

    await notificationRepo.create({
      userId: booking.requesterId,
      bookingId: booking.id,
      channel: "IN_APP",
      template: event.type
    });
  }
};
