import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { requestContext } from "./middlewares/request-context.middleware.js";
import { env } from "./config/env.js";
import { eventBus } from "./events/event-bus.js";
import { notificationHandler } from "./events/handlers/notification.handler.js";
import { auditHandler } from "./events/handlers/audit.handler.js";
import { analyticsHandler } from "./events/handlers/analytics.handler.js";
import { BookingEvents } from "./events/booking.events.js";

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(requestContext);

  eventBus.subscribe(BookingEvents.CREATED, notificationHandler);
  eventBus.subscribe(BookingEvents.CREATED, auditHandler);
  eventBus.subscribe(BookingEvents.CREATED, analyticsHandler);

  eventBus.subscribe(BookingEvents.APPROVED, notificationHandler);
  eventBus.subscribe(BookingEvents.APPROVED, auditHandler);
  eventBus.subscribe(BookingEvents.APPROVED, analyticsHandler);

  eventBus.subscribe(BookingEvents.REJECTED, notificationHandler);
  eventBus.subscribe(BookingEvents.REJECTED, auditHandler);
  eventBus.subscribe(BookingEvents.REJECTED, analyticsHandler);

  eventBus.subscribe(BookingEvents.CANCELLED, notificationHandler);
  eventBus.subscribe(BookingEvents.CANCELLED, auditHandler);
  eventBus.subscribe(BookingEvents.CANCELLED, analyticsHandler);

  app.use("/api/v1", routes);
  app.use(errorMiddleware);

  return app;
};
