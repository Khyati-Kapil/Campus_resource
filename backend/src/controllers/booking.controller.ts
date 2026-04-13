import { Request, Response } from "express";
import { BookingService } from "../services/booking.service.js";
import { ok } from "../utils/api-response.js";

const bookingService = new BookingService();

export const createBooking = async (req: Request, res: Response) => {
  const result = await bookingService.create(req.body, req.user);
  return res.status(201).json(ok(result));
};

export const cancelBooking = async (req: Request, res: Response) => {
  const result = await bookingService.cancel(req.params.id, req.user);
  return res.json(ok(result));
};

export const listBookings = async (req: Request, res: Response) => {
  const result = await bookingService.list(req.query, req.user);
  return res.json(ok(result));
};
