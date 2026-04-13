import { prisma } from "../config/prisma.js";

export class NotificationRepository {
  async create(data: { userId: string; bookingId?: string | null; channel: "EMAIL" | "IN_APP"; template: string }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        bookingId: data.bookingId ?? null,
        channel: data.channel,
        template: data.template
      }
    });
  }
}
