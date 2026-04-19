import { Server } from "socket.io";
import { NotificationModel } from "../models/Notification.js";

export const createNotifier = (io: Server) => {
  const notify = async (input: {
    userId: string;
    type: string;
    message: string;
    meta?: Record<string, unknown>;
  }) => {
    const notification = await NotificationModel.create({
      userId: input.userId,
      type: input.type,
      message: input.message,
      meta: input.meta ?? {}
    });

    io.to(`user:${input.userId}`).emit("notification:new", {
      id: notification.id,
      type: notification.type,
      message: notification.message,
      createdAt: notification.createdAt
    });

    return notification;
  };

  return { notify };
};
