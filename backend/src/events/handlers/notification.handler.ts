import { DomainEvent } from "../event-bus.js";
import { logger } from "../../config/logger.js";

export const notificationHandler = async (event: DomainEvent) => {
  logger.info("notification handler received", { type: event.type });
  // TODO: enqueue notification jobs
};
