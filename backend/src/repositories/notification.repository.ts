import { prisma } from "../config/prisma.js";

export type NotificationStatus = "QUEUED" | "SENT" | "FAILED";

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

  async updateAttempt(id: string, status: NotificationStatus, retryCount: number, sentAt?: Date | null) {
    return prisma.notification.update({
      where: { id },
      data: {
        status,
        retryCount,
        sentAt: sentAt ?? null
      }
    });
  }
}
