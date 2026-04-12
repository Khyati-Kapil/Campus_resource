import jwt from "jsonwebtoken";
import { env } from "./env.js";

export type JwtClaims = {
  sub: string;
  role: string;
};

export const jwtProvider = {
  signAccess: (claims: JwtClaims) =>
    jwt.sign(claims, env.jwtAccessSecret, { expiresIn: env.jwtAccessTtl }),
  signRefresh: (claims: JwtClaims) =>
    jwt.sign(claims, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshTtl }),
  verifyAccess: (token: string) => jwt.verify(token, env.jwtAccessSecret),
  verifyRefresh: (token: string) => jwt.verify(token, env.jwtRefreshSecret)
};
