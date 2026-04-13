import { BookingRepository } from "../repositories/booking.repository.js";

export class ConflictDetectionService {
  private repo: BookingRepository;

  constructor(repo?: BookingRepository) {
    this.repo = repo ?? new BookingRepository();
  }

  async checkConflict(resourceId: string, startTime: Date, endTime: Date) {
    const overlaps = await this.repo.findOverlaps(resourceId, startTime, endTime, ["PENDING", "APPROVED"]);
    return overlaps.length > 0;
  }
}
