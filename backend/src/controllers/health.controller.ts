import { Request, Response } from "express";
import { ok } from "../utils/api-response.js";

export const healthCheck = (_req: Request, res: Response) => {
  return res.json(ok({ status: "ok" }));
};
