import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "./env.js";

export type JwtClaims = {
  sub: string;
  role: string;
};

export const jwtProvider = {
  signAccess: (claims: JwtClaims) =>
    jwt.sign(claims, env.jwtAccessSecret, { expiresIn: env.jwtAccessTtl as SignOptions["expiresIn"] }),
  signRefresh: (claims: JwtClaims) =>
    jwt.sign(claims, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshTtl as SignOptions["expiresIn"] }),
  verifyAccess: (token: string) => jwt.verify(token, env.jwtAccessSecret),
  verifyRefresh: (token: string) => jwt.verify(token, env.jwtRefreshSecret)
};
