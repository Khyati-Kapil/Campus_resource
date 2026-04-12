import { BookingRepository } from "../repositories/booking.repository.js";

const repo = new BookingRepository();

export class ConflictDetectionService {
  async checkConflict(resourceId: string, startTime: Date, endTime: Date) {
    const overlaps = await repo.findOverlaps(resourceId, startTime, endTime, ["PENDING", "APPROVED"]);
    return overlaps.length > 0;
  }
}
