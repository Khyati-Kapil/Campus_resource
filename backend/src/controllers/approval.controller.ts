import { Request, Response } from "express";
import { ApprovalService } from "../services/approval.service.js";
import { ok } from "../utils/api-response.js";

const approvalService = new ApprovalService();

export const approveBooking = async (req: Request, res: Response) => {
  const result = await approvalService.approve(req.params.bookingId, req.user, req.body);
  return res.json(ok(result));
};

export const rejectBooking = async (req: Request, res: Response) => {
  const result = await approvalService.reject(req.params.bookingId, req.user, req.body);
  return res.json(ok(result));
};
