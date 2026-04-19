import { Router } from "express";
import { loginUser, registerUser } from "../services/authService.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
  try {
    const data = await registerUser(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/login", async (req, res, next) => {
  try {
    const data = await loginUser(req.body);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});
