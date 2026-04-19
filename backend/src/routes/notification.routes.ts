import { Router } from "express";
import { listNotifications } from "../controllers/notification.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { listNotificationsSchema } from "../models/dto/notification.dto.js";

const router = Router();

router.get("/", requireAuth, validate(listNotificationsSchema), listNotifications);

export default router;
