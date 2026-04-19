import { NextFunction, Request, Response } from "express";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const message = err instanceof Error ? err.message : "Unexpected error";
  return res.status(400).json({ success: false, error: { code: "BAD_REQUEST", message } });
};
