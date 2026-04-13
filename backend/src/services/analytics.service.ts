import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/app-error.js";

export class AnalyticsService {
  async usage(query?: { from?: string; to?: string }) {
    const from = query?.from ? new Date(query.from) : undefined;
    const to = query?.to ? new Date(query.to) : undefined;

    if (from && Number.isNaN(from.getTime())) {
      throw new AppError(400, "VALIDATION_ERROR", "Invalid from date");
    }

    if (to && Number.isNaN(to.getTime())) {
      throw new AppError(400, "VALIDATION_ERROR", "Invalid to date");
    }

    const where: Record<string, unknown> = {};
    if (from || to) {
      where.startTime = {
        ...(from ? { gte: from } : {}),
        ...(to ? { lte: to } : {})
      };
    }

    const [totalBookings, approvedBookings] = await Promise.all([
      prisma.booking.count({ where }),
      prisma.booking.count({ where: { ...where, status: "APPROVED" } })
    ]);

    const bookings = await prisma.booking.findMany({
      where,
      select: { startTime: true }
    });

    const hourCounts: Record<string, number> = {};
    for (const booking of bookings) {
      const hour = booking.startTime.getHours().toString().padStart(2, "0");
      hourCounts[hour] = (hourCounts[hour] ?? 0) + 1;
    }

    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalBookings,
      approvedBookings,
      utilizationRate: totalBookings ? approvedBookings / totalBookings : 0,
      peakHours
    };
  }
}
