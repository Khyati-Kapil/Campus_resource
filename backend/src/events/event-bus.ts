export type DomainEvent = {
  type: string;
  payload: Record<string, unknown>;
  occurredAt: Date;
};

type Handler = (event: DomainEvent) => void | Promise<void>;

class EventBus {
  private handlers: Record<string, Handler[]> = {};

  subscribe(type: string, handler: Handler) {
    this.handlers[type] = this.handlers[type] ?? [];
    this.handlers[type].push(handler);
  }

  async publish(event: DomainEvent) {
    const handlers = this.handlers[event.type] ?? [];
    for (const handler of handlers) {
      await handler(event);
    }
  }
}

export const eventBus = new EventBus();
