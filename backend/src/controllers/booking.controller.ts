import { Request, Response } from "express";
import { BookingService } from "../services/booking.service.js";
import { ok } from "../utils/api-response.js";

export const createBookingHandler = (service = new BookingService()) => async (req: Request, res: Response) => {
  const result = await service.create(req.body, req.user);
  return res.status(201).json(ok(result));
};

export const cancelBookingHandler = (service = new BookingService()) => async (req: Request, res: Response) => {
  const result = await service.cancel(req.params.id, req.user);
  return res.json(ok(result));
};

export const listBookingsHandler = (service = new BookingService()) => async (req: Request, res: Response) => {
  const result = await service.list(req.query, req.user);
  return res.json(ok(result));
};

export const createBooking = createBookingHandler();
export const cancelBooking = cancelBookingHandler();
export const listBookings = listBookingsHandler();
