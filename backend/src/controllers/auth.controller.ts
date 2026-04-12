import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import { ok } from "../utils/api-response.js";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  return res.status(201).json(ok(result));
};

export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return res.json(ok(result));
};

export const refresh = async (req: Request, res: Response) => {
  const result = await authService.refresh(req.body?.refreshToken as string);
  return res.json(ok(result));
};
