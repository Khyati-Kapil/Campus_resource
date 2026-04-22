import { Request, Response } from "express";
import { ok, fail } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { prisma } from "../config/prisma.js";

export const healthCheck = (_req: Request, res: Response) => {
  return res.json(ok({ status: "ok" }));
};

export const dbHealthCheck = asyncHandler(async (_req: Request, res: Response) => {
  try {
    // Prisma MongoDB supports runCommandRaw for admin commands like ping.
    await prisma.$runCommandRaw({ ping: 1 });
    return res.json(ok({ db: "ok" }));
  } catch (err) {
    const message = err instanceof Error ? err.message : "DB ping failed";
    return res.status(500).json(fail("DB_UNAVAILABLE", message));
  }
});
