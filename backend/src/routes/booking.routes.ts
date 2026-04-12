import { Router } from "express";
import { cancelBooking, createBooking } from "../controllers/booking.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.middleware.js";
import { cancelBookingSchema, createBookingSchema } from "../models/dto/booking.dto.js";

const router = Router();

router.post("/", requireAuth, validate(createBookingSchema), createBooking);
router.patch("/:id/cancel", requireAuth, validate(cancelBookingSchema), cancelBooking);

export default router;
