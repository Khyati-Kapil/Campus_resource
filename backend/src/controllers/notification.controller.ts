import { Request, Response } from "express";
import { NotificationQueryService } from "../services/notification-query.service.js";
import { ok } from "../utils/api-response.js";

const service = new NotificationQueryService();

export const listNotifications = async (req: Request, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20;
  const result = await service.listForUser(req.user?.id ?? "", page, pageSize);
  return res.json(ok(result));
};
