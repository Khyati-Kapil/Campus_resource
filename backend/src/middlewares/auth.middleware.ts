import { NextFunction, Request, Response } from "express";
import { jwtProvider } from "../config/jwt.js";
import { AppError } from "../utils/app-error.js";

export type AuthUser = {
  id: string;
  role: string;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return next(new AppError(401, "UNAUTHORIZED", "Missing bearer token"));
  }

  const token = auth.substring("Bearer ".length);
  try {
    const decoded = jwtProvider.verifyAccess(token) as { sub: string; role: string };
    req.user = { id: decoded.sub, role: decoded.role } as AuthUser;
    return next();
  } catch {
    return next(new AppError(401, "UNAUTHORIZED", "Invalid token"));
  }
};
