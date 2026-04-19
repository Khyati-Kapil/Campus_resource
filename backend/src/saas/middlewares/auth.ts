import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const raw = req.headers.authorization;
  if (!raw?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing token" } });
  }

  try {
    const payload = jwt.verify(raw.slice(7), env.jwtAccessSecret) as {
      sub: string;
      role: "ADMIN" | "FACULTY" | "STUDENT";
      name: string;
      email: string;
    };
    req.user = { id: payload.sub, role: payload.role, name: payload.name, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Invalid token" } });
  }
};
