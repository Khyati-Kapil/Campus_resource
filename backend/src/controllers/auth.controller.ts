import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { ok } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  return res.status(201).json(ok(result));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return res.json(ok(result));
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.refresh(req.body?.refreshToken as string);
  return res.json(ok(result));
});
