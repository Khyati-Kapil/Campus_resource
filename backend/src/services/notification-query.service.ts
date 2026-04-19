import { NotificationRepository } from "../repositories/notification.repository.js";
import { AppError } from "../utils/app-error.js";

export class NotificationQueryService {
  private repo: NotificationRepository;

  constructor(repo?: NotificationRepository) {
    this.repo = repo ?? new NotificationRepository();
  }

  async listForUser(userId: string, page = 1, pageSize = 20) {
    if (!userId) {
      throw new AppError(400, "VALIDATION_ERROR", "User id required");
    }

    const skip = (page - 1) * pageSize;
    const { items, total } = await this.repo.listByUser(userId, skip, pageSize);

    return { items, total, page, pageSize };
  }
}
