import { DomainEvent } from "../event-bus.js";
import { logger } from "../../config/logger.js";

export const analyticsHandler = async (event: DomainEvent) => {
  logger.info("analytics handler received", { type: event.type });
  // TODO: update analytics projections
};
