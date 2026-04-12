import { DomainEvent } from "../event-bus.js";
import { logger } from "../../config/logger.js";

export const auditHandler = async (event: DomainEvent) => {
  logger.info("audit handler received", { type: event.type });
  // TODO: persist audit log
};
