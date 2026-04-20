import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/error.js";
import { authRouter } from "./routes/auth.js";
import { resourceRouter } from "./routes/resources.js";
import { createBookingRouter } from "./routes/bookings.js";
import { notificationRouter } from "./routes/notifications.js";
import { auditRouter } from "./routes/audit.js";
import { analyticsRouter } from "./routes/analytics.js";

export const createSaasServer = () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: env.corsOrigin, credentials: true }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));
    try {
      const payload = jwt.verify(token, env.jwtAccessSecret) as { sub: string };
      socket.join(`user:${payload.sub}`);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  app.use(helmet());
  app.use(cors({ origin: true, credentials: true })); 
  app.use(morgan("dev"));
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ success: true, data: { status: "ok" } }));

  app.use("/api/auth", authRouter);
  app.use("/api/resources", resourceRouter);
  app.use("/api/bookings", createBookingRouter(io));
  app.use("/api/notifications", notificationRouter);
  app.use("/api/audit", auditRouter);
  app.use("/api/analytics", analyticsRouter);

  app.use(errorHandler);

  return { app, server, io };
};
