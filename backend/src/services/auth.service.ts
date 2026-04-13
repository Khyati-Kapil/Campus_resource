import bcrypt from "bcryptjs";
import { AppError } from "../utils/app-error.js";
import { jwtProvider as defaultJwtProvider } from "../config/jwt.js";
import { env } from "../config/env.js";
import { UserRepository } from "../repositories/user.repository.js";
import { RefreshTokenRepository } from "../repositories/refresh-token.repository.js";
import { computeExpiry } from "../utils/time.js";
import { hashToken } from "../utils/hash.js";

type JwtLike = {
  signAccess: (claims: { sub: string; role: string }) => string;
  signRefresh: (claims: { sub: string; role: string }) => string;
  verifyRefresh: (token: string) => unknown;
};

export class AuthService {
  private userRepo: UserRepository;
  private refreshRepo: RefreshTokenRepository;
  private jwt: JwtLike;
  private refreshTtl: string;

  constructor(deps?: {
    userRepo?: UserRepository;
    refreshRepo?: RefreshTokenRepository;
    jwtProvider?: JwtLike;
    refreshTtl?: string;
  }) {
    this.userRepo = deps?.userRepo ?? new UserRepository();
    this.refreshRepo = deps?.refreshRepo ?? new RefreshTokenRepository();
    this.jwt = deps?.jwtProvider ?? defaultJwtProvider;
    this.refreshTtl = deps?.refreshTtl ?? env.jwtRefreshTtl;
  }

  async register(payload: Record<string, unknown>) {
    if (!payload?.email || !payload?.password || !payload?.name) {
      throw new AppError(400, "VALIDATION_ERROR", "Name, email and password required");
    }

    const existing = await this.userRepo.findByEmail(String(payload.email));
    if (existing) {
      throw new AppError(409, "DUPLICATE", "Email already in use");
    }

    const passwordHash = await bcrypt.hash(String(payload.password), 10);
    const role = (payload.role ?? "STUDENT") as "STUDENT" | "FACULTY" | "ADMIN";

    const user = await this.userRepo.create({
      name: String(payload.name),
      email: String(payload.email),
      passwordHash,
      role,
      department: payload.department ? String(payload.department) : null,
      externalId: payload.externalId ? String(payload.externalId) : null
    });

    const claims = { sub: user.id, role: user.role };
    const refreshToken = this.jwt.signRefresh(claims);
    await this.refreshRepo.create({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: computeExpiry(this.refreshTtl)
    });

    return {
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
      accessToken: this.jwt.signAccess(claims),
      refreshToken
    };
  }

  async login(payload: Record<string, unknown>) {
    if (!payload?.email || !payload?.password) {
      throw new AppError(400, "VALIDATION_ERROR", "Email and password required");
    }

    const user = await this.userRepo.findByEmail(String(payload.email));
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid credentials");
    }

    const ok = await bcrypt.compare(String(payload.password), user.passwordHash);
    if (!ok) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid credentials");
    }

    const claims = { sub: user.id, role: user.role };
    const refreshToken = this.jwt.signRefresh(claims);
    await this.refreshRepo.create({
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: computeExpiry(this.refreshTtl)
    });

    return {
      user: { id: user.id, email: user.email, role: user.role, name: user.name },
      accessToken: this.jwt.signAccess(claims),
      refreshToken
    };
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new AppError(400, "VALIDATION_ERROR", "Refresh token required");
    }

    const decoded = this.jwt.verifyRefresh(refreshToken) as { sub: string; role: string };
    const tokenHash = hashToken(refreshToken);
    const stored = await this.refreshRepo.findByHash(tokenHash);

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new AppError(401, "UNAUTHORIZED", "Invalid refresh token");
    }

    await this.refreshRepo.revoke(stored.id);

    const nextRefresh = this.jwt.signRefresh({ sub: decoded.sub, role: decoded.role });
    await this.refreshRepo.create({
      userId: decoded.sub,
      tokenHash: hashToken(nextRefresh),
      expiresAt: computeExpiry(this.refreshTtl)
    });

    return {
      accessToken: this.jwt.signAccess({ sub: decoded.sub, role: decoded.role }),
      refreshToken: nextRefresh
    };
  }
}
