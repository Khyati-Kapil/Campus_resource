import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { AppError } from "../utils/app-error.js";

export const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query
  });

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({ path: issue.path, message: issue.message }));
    return next(new AppError(400, "VALIDATION_ERROR", "Invalid request payload", { issues }));
  }

  return next();
};
