import { BookingRepositoryInterface, BookingRecord, BookingStatus } from "../interfaces/booking-repository.interface.js";

export class BookingRepository implements BookingRepositoryInterface {
  async create(data: Omit<BookingRecord, "id" | "version">): Promise<BookingRecord> {
    return { ...data, id: "pending", version: 1 };
  }

  async findById(_id: string): Promise<BookingRecord | null> {
    return null;
  }

  async findOverlaps(
    _resourceId: string,
    _start: Date,
    _end: Date,
    _statuses: BookingStatus[]
  ): Promise<BookingRecord[]> {
    return [];
  }

  async updateStatus(id: string, status: BookingStatus, version: number): Promise<BookingRecord> {
    return {
      id,
      resourceId: "pending",
      requesterId: "pending",
      startTime: new Date(),
      endTime: new Date(),
      status,
      version: version + 1
    };
  }

  async cancel(id: string, _reason: string, version: number): Promise<BookingRecord> {
    return {
      id,
      resourceId: "pending",
      requesterId: "pending",
      startTime: new Date(),
      endTime: new Date(),
      status: "CANCELLED",
      version: version + 1
    };
  }
}
