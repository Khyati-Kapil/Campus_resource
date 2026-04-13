import { prisma } from "../config/prisma.js";
import { BookingRepositoryInterface, BookingRecord, BookingStatus } from "../interfaces/booking-repository.interface.js";

export type BookingListFilters = {
  status?: BookingStatus;
  resourceId?: string;
  requesterId?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
};

export class BookingRepository implements BookingRepositoryInterface {
  async create(data: Omit<BookingRecord, "id" | "version">): Promise<BookingRecord> {
    const created = await prisma.booking.create({
      data: {
        resourceId: data.resourceId,
        requesterId: data.requesterId,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        purpose: data.purpose ?? null,
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
      version: created.version,
      purpose: created.purpose ?? null
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
      version: found.version,
      purpose: found.purpose ?? null
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
      version: item.version,
      purpose: item.purpose ?? null
    }));
  }

  async list(filters: BookingListFilters) {
    const where: Record<string, unknown> = {};

    if (filters.status) where.status = filters.status;
    if (filters.resourceId) where.resourceId = filters.resourceId;
    if (filters.requesterId) where.requesterId = filters.requesterId;
    if (filters.from || filters.to) {
      where.startTime = {
        ...(filters.from ? { gte: filters.from } : {}),
        ...(filters.to ? { lte: filters.to } : {})
      };
    }

    const [items, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { startTime: "asc" },
        skip: filters.skip,
        take: filters.take
      }),
      prisma.booking.count({ where })
    ]);

    return {
      items: items.map((item) => ({
        id: item.id,
        resourceId: item.resourceId,
        requesterId: item.requesterId,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status as BookingStatus,
        version: item.version,
        purpose: item.purpose ?? null
      })),
      total
    };
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
      version: updated.version,
      purpose: updated.purpose ?? null
    };
  }

  async cancel(id: string, _reason: string, version: number): Promise<BookingRecord> {
    return this.updateStatus(id, "CANCELLED", version);
  }
}
