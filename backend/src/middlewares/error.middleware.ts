import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";
import { fail } from "../utils/api-response.js";
import { logger } from "../config/logger.js";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn(err.message, { code: err.code, requestId: res.locals.requestId });
    return res.status(err.statusCode).json(fail(err.code, err.message, res.locals.requestId));
  }

  logger.error(err.message, { requestId: res.locals.requestId });
  return res.status(500).json(fail("INTERNAL_ERROR", "Unexpected error", res.locals.requestId));
};
