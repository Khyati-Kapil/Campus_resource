import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import http from "http";
import { initSocket } from "./realtime/socket.js";

const app = createApp();

const server = http.createServer(app);
initSocket(server);

server.listen(env.port, () => {
  logger.info(`CampusSync backend listening on port ${env.port}`);
});
