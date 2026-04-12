import { DomainEvent } from "../events/event-bus.js";

export class NotificationService {
  async dispatch(_event: DomainEvent) {
    return { queued: true };
  }
}
