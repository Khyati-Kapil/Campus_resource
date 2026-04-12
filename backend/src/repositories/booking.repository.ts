import { prisma } from "../config/prisma.js";
import { BookingRepositoryInterface, BookingRecord, BookingStatus } from "../interfaces/booking-repository.interface.js";

export class BookingRepository implements BookingRepositoryInterface {
  async create(data: Omit<BookingRecord, "id" | "version">): Promise<BookingRecord> {
    const created = await prisma.booking.create({
      data: {
        resourceId: data.resourceId,
        requesterId: data.requesterId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        slotKey: `${data.resourceId}:${data.startTime.toISOString()}:${data.endTime.toISOString()}`
      }
    });

    return {
      id: created.id,
      resourceId: created.resourceId,
      requesterId: created.requesterId,
      startTime: created.startTime,
      endTime: created.endTime,
      status: created.status as BookingStatus,
      version: created.version
    };
  }

  async findById(id: string): Promise<BookingRecord | null> {
    const found = await prisma.booking.findUnique({ where: { id } });
    if (!found) return null;

    return {
      id: found.id,
      resourceId: found.resourceId,
      requesterId: found.requesterId,
      startTime: found.startTime,
      endTime: found.endTime,
      status: found.status as BookingStatus,
      version: found.version
    };
  }

  async findOverlaps(
    resourceId: string,
    start: Date,
    end: Date,
    statuses: BookingStatus[]
  ): Promise<BookingRecord[]> {
    const results = await prisma.booking.findMany({
      where: {
        resourceId,
        status: { in: statuses },
        startTime: { lt: end },
        endTime: { gt: start }
      }
    });

    return results.map((item) => ({
      id: item.id,
      resourceId: item.resourceId,
      requesterId: item.requesterId,
      startTime: item.startTime,
      endTime: item.endTime,
      status: item.status as BookingStatus,
      version: item.version
    }));
  }

  async updateStatus(id: string, status: BookingStatus, version: number): Promise<BookingRecord> {
    const updated = await prisma.booking.update({
      where: { id },
      data: { status, version: version + 1 }
    });

    return {
      id: updated.id,
      resourceId: updated.resourceId,
      requesterId: updated.requesterId,
      startTime: updated.startTime,
      endTime: updated.endTime,
      status: updated.status as BookingStatus,
      version: updated.version
    };
  }

  async cancel(id: string, _reason: string, version: number): Promise<BookingRecord> {
    return this.updateStatus(id, "CANCELLED", version);
  }
}
