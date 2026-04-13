import { NotificationRepository } from "../repositories/notification.repository.js";

export type NotificationRecord = {
  id: string;
  userId: string;
  bookingId?: string | null;
  channel: "EMAIL" | "IN_APP";
  template: string;
  retryCount: number;
};

type Strategy = {
  send: (notification: NotificationRecord) => Promise<void>;
};

class InAppStrategy implements Strategy {
  async send(_notification: NotificationRecord) {
    return;
  }
}

class EmailStrategy implements Strategy {
  async send(_notification: NotificationRecord) {
    return;
  }
}

export class NotificationService {
  private repo: NotificationRepository;
  private strategies: Record<string, Strategy>;
  private maxRetries = 3;

  constructor(repo?: NotificationRepository) {
    this.repo = repo ?? new NotificationRepository();
    this.strategies = {
      IN_APP: new InAppStrategy(),
      EMAIL: new EmailStrategy()
    };
  }

  async deliver(notification: NotificationRecord) {
    const strategy = this.strategies[notification.channel];
    try {
      await strategy.send(notification);
      await this.repo.updateAttempt(notification.id, "SENT", notification.retryCount, new Date());
      return { sent: true };
    } catch {
      const nextRetry = notification.retryCount + 1;
      const status = nextRetry >= this.maxRetries ? "FAILED" : "QUEUED";
      await this.repo.updateAttempt(notification.id, status, nextRetry, null);
      return { sent: false };
    }
  }
}
