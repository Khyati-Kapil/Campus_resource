import { describe, it, expect, vi, beforeEach } from "vitest";

process.env.DATABASE_URL = process.env.DATABASE_URL ?? "mongodb://localhost:27017/test";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "access_test";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "refresh_test";

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn()
  }
}));

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registers a new user and stores refresh token", async () => {
    const bcrypt = (await import("bcryptjs")).default as { hash: ReturnType<typeof vi.fn> };
    bcrypt.hash.mockResolvedValue("hash");

    const userRepo = {
      findByEmail: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ id: "u1", email: "a@b.com", role: "STUDENT", name: "A" })
    };
    const refreshRepo = {
      create: vi.fn(),
      findByHash: vi.fn(),
      revoke: vi.fn()
    };
    const jwt = {
      signAccess: vi.fn().mockReturnValue("access"),
      signRefresh: vi.fn().mockReturnValue("refresh"),
      verifyRefresh: vi.fn()
    };

    const { AuthService } = await import("../src/services/auth.service.js");
    const service = new AuthService({ userRepo: userRepo as any, refreshRepo: refreshRepo as any, jwtProvider: jwt as any, refreshTtl: "7d" });

    const result = await service.register({ name: "A", email: "a@b.com", password: "secret" });

    expect(result.accessToken).toBe("access");
    expect(result.refreshToken).toBe("refresh");
    expect(refreshRepo.create).toHaveBeenCalledTimes(1);
  });

  it("rotates refresh tokens", async () => {
    const bcrypt = (await import("bcryptjs")).default as { compare: ReturnType<typeof vi.fn> };
    bcrypt.compare.mockResolvedValue(true);

    const refreshRepo = {
      create: vi.fn(),
      findByHash: vi.fn().mockResolvedValue({ id: "t1", revokedAt: null, expiresAt: new Date(Date.now() + 10000) }),
      revoke: vi.fn()
    };

    const jwt = {
      signAccess: vi.fn().mockReturnValue("access"),
      signRefresh: vi.fn().mockReturnValue("newrefresh"),
      verifyRefresh: vi.fn().mockReturnValue({ sub: "u1", role: "STUDENT" })
    };

    const { AuthService } = await import("../src/services/auth.service.js");
    const service = new AuthService({ refreshRepo: refreshRepo as any, jwtProvider: jwt as any, refreshTtl: "7d" });

    const result = await service.refresh("oldrefresh");

    expect(result.refreshToken).toBe("newrefresh");
    expect(refreshRepo.revoke).toHaveBeenCalledTimes(1);
    expect(refreshRepo.create).toHaveBeenCalledTimes(1);
  });
});
