import bcrypt from "bcryptjs";
import { AppError } from "../utils/app-error.js";
import { jwtProvider } from "../config/jwt.js";

export class AuthService {
  async register(payload: Record<string, unknown>) {
    if (!payload?.email || !payload?.password) {
      throw new AppError(400, "VALIDATION_ERROR", "Email and password required");
    }

    const passwordHash = await bcrypt.hash(String(payload.password), 10);

    return {
      user: {
        id: "pending",
        email: payload.email,
        role: payload.role ?? "STUDENT"
      },
      passwordHash
    };
  }

  async login(payload: Record<string, unknown>) {
    if (!payload?.email || !payload?.password) {
      throw new AppError(400, "VALIDATION_ERROR", "Email and password required");
    }

    const claims = { sub: "pending", role: "STUDENT" };
    return {
      accessToken: jwtProvider.signAccess(claims),
      refreshToken: jwtProvider.signRefresh(claims)
    };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new AppError(400, "VALIDATION_ERROR", "Refresh token required");
    }

    const decoded = jwtProvider.verifyRefresh(refreshToken) as { sub: string; role: string };
    return {
      accessToken: jwtProvider.signAccess({ sub: decoded.sub, role: decoded.role })
    };
  }
}
