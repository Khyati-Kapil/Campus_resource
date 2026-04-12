import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error.js";

export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as { role?: string } | undefined;
    if (!user?.role || !roles.includes(user.role)) {
      return next(new AppError(403, "FORBIDDEN", "Insufficient permissions"));
    }
    return next();
  };
};
