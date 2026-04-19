import { NextFunction, Request, Response } from "express";

export const requireRole = (...roles: Array<"ADMIN" | "FACULTY" | "STUDENT">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: { code: "FORBIDDEN", message: "Forbidden" } });
    }
    next();
  };
};
