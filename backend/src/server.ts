import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import http from "http";
import { initSocket } from "./realtime/socket.js";

process.on("unhandledRejection", (reason) => {
  logger.error("unhandledRejection", { reason: String(reason) });
});

process.on("uncaughtException", (err) => {
  logger.error("uncaughtException", { error: err.message });
});

const app = createApp();

const server = http.createServer(app);
initSocket(server);

server.listen(env.port, () => {
  logger.info(`CampusSync backend listening on port ${env.port}`);
});
