import bcrypt from "bcryptjs";
import { AppError } from "../utils/app-error.js";
import { jwtProvider } from "../config/jwt.js";
import { UserRepository } from "../repositories/user.repository.js";

const repo = new UserRepository();

export class AuthService {
  async register(payload: Record<string, unknown>) {
    if (!payload?.email || !payload?.password || !payload?.name) {
      throw new AppError(400, "VALIDATION_ERROR", "Name, email and password required");
    }

    const existing = await repo.findByEmail(String(payload.email));
    if (existing) {
      throw new AppError(409, "DUPLICATE", "Email already in use");
    }

    const passwordHash = await bcrypt.hash(String(payload.password), 10);
    const role = (payload.role ?? "STUDENT") as "STUDENT" | "FACULTY" | "ADMIN";

    const user = await repo.create({
      name: String(payload.name),
      email: String(payload.email),
      passwordHash,
      role,
      department: payload.department ? String(payload.department) : null,
      externalId: payload.externalId ? String(payload.externalId) : null
    });

    const claims = { sub: user.id, role: user.role };

    return {
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
      accessToken: jwtProvider.signAccess(claims),
      refreshToken: jwtProvider.signRefresh(claims)
    };
  }

  async login(payload: Record<string, unknown>) {
    if (!payload?.email || !payload?.password) {
      throw new AppError(400, "VALIDATION_ERROR", "Email and password required");
    }

    const user = await repo.findByEmail(String(payload.email));
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid credentials");
    }

    const ok = await bcrypt.compare(String(payload.password), user.passwordHash);
    if (!ok) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid credentials");
    }

    const claims = { sub: user.id, role: user.role };

    return {
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
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
