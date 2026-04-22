import { BookingRepository } from "../repositories/booking.repository.js";
import { lockManager } from "../utils/lock-manager.js";

export class ConflictDetectionService {
  private repo: BookingRepository;

  constructor(repo?: BookingRepository) {
    this.repo = repo ?? new BookingRepository();
  }

  async checkConflict(resourceId: string, startTime: Date, endTime: Date) {
    const overlaps = await this.repo.findOverlaps(resourceId, startTime, endTime, ["PENDING", "APPROVED"]);
    return overlaps.length > 0;
  }

  async withSlotLock<T>(slotKey: string, fn: () => Promise<T>): Promise<T> {
    return lockManager.runExclusive(slotKey, fn);
  }
}
