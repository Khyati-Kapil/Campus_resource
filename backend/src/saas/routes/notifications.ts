import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { NotificationModel } from "../models/Notification.js";

export const notificationRouter = Router();

notificationRouter.get("/", requireAuth, async (req, res, next) => {
  try {
    const items = await NotificationModel.find({ userId: req.user!.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: { items } });
  } catch (error) {
    next(error);
  }
});
