import { Request, Response } from "express";
import { AnalyticsService } from "../services/analytics.service.js";
import { ok } from "../utils/api-response.js";

const analyticsService = new AnalyticsService();

export const usageReport = async (req: Request, res: Response) => {
  const result = await analyticsService.usage({ from: req.query.from as string | undefined, to: req.query.to as string | undefined });
  return res.json(ok(result));
};
