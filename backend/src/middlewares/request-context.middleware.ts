import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export const requestContext = (req: Request, res: Response, next: NextFunction) => {
  const requestId = crypto.randomUUID();
  res.locals.requestId = requestId;
  res.setHeader("x-request-id", requestId);
  next();
};
