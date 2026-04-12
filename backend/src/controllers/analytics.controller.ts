import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service.js";
import { ok } from "../utils/api-response.js";

const analyticsService = new AnalyticsService();

export const usageReport = async (_req: Request, res: Response) => {
  const result = await analyticsService.usage();
  return res.json(ok(result));
};
