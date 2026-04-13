import { Request, Response } from "express";
import { ApprovalService } from "../services/approval.service.js";
import { ok } from "../utils/api-response.js";

export const approveBookingHandler = (service = new ApprovalService()) => async (req: Request, res: Response) => {
  const result = await service.approve(req.params.bookingId, req.user, req.body);
  return res.json(ok(result));
};

export const rejectBookingHandler = (service = new ApprovalService()) => async (req: Request, res: Response) => {
  const result = await service.reject(req.params.bookingId, req.user, req.body);
  return res.json(ok(result));
};

export const approveBooking = approveBookingHandler();
export const rejectBooking = rejectBookingHandler();
