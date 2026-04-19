import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UserModel } from "../models/User.js";

export const registerUser = async (input: {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "FACULTY" | "STUDENT";
}) => {
  const existing = await UserModel.findOne({ email: input.email.toLowerCase() });
  if (existing) throw new Error("Email already exists");

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await UserModel.create({
    name: input.name,
    email: input.email.toLowerCase(),
    passwordHash,
    role: input.role ?? "STUDENT"
  });

  const accessToken = jwt.sign({ sub: user.id, role: user.role, name: user.name, email: user.email }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessTtl as any
  });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken
  };
};

export const loginUser = async (input: { email: string; password: string }) => {
  const user = await UserModel.findOne({ email: input.email.toLowerCase() });
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(input.password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");

  const accessToken = jwt.sign({ sub: user.id, role: user.role, name: user.name, email: user.email }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessTtl as any
  });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken
  };
};
