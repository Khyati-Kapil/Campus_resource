import { DomainEvent } from "../event-bus.js";
import { NotificationRepository } from "../../repositories/notification.repository.js";
import { BookingRepository } from "../../repositories/booking.repository.js";
import { NotificationService } from "../../services/notification.service.js";

const notificationRepo = new NotificationRepository();
const bookingRepo = new BookingRepository();
const notificationService = new NotificationService(notificationRepo);

const deliver = async (record: { id: string; userId: string; bookingId?: string | null; channel: "EMAIL" | "IN_APP"; template: string; retryCount: number }) => {
  await notificationService.deliver({
    id: record.id,
    userId: record.userId,
    bookingId: record.bookingId,
    channel: record.channel,
    template: record.template,
    retryCount: record.retryCount
  });
};

export const notificationHandler = async (event: DomainEvent) => {
  if (event.type === "BOOKING_CREATED") {
    const payload = event.payload as { requesterId?: string; id?: string };
    if (payload.requesterId) {
      const inApp = await notificationRepo.create({
        userId: payload.requesterId,
        bookingId: payload.id ?? null,
        channel: "IN_APP",
        template: "BOOKING_CREATED"
      });
      await deliver(inApp);
    }
    return;
  }

  if (event.type === "BOOKING_CANCELLED") {
    const payload = event.payload as { requesterId?: string; id?: string };
    if (payload.requesterId) {
      const inApp = await notificationRepo.create({
        userId: payload.requesterId,
        bookingId: payload.id ?? null,
        channel: "IN_APP",
        template: "BOOKING_CANCELLED"
      });
      await deliver(inApp);

      const email = await notificationRepo.create({
        userId: payload.requesterId,
        bookingId: payload.id ?? null,
        channel: "EMAIL",
        template: "BOOKING_CANCELLED"
      });
      await deliver(email);
    }
    return;
  }

  if (event.type === "BOOKING_APPROVED" || event.type === "BOOKING_REJECTED") {
    const payload = event.payload as { booking?: { id?: string } };
    const bookingId = payload.booking?.id;
    if (!bookingId) return;

    const booking = await bookingRepo.findById(bookingId);
    if (!booking) return;

    const inApp = await notificationRepo.create({
      userId: booking.requesterId,
      bookingId: booking.id,
      channel: "IN_APP",
      template: event.type
    });
    await deliver(inApp);

    const email = await notificationRepo.create({
      userId: booking.requesterId,
      bookingId: booking.id,
      channel: "EMAIL",
      template: event.type
    });
    await deliver(email);
  }
};
