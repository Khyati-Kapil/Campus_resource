import { describe, it, expect, vi } from "vitest";
import { AppError } from "../src/utils/app-error.js";

process.env.DATABASE_URL = process.env.DATABASE_URL ?? "mongodb://localhost:27017/test";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "access_test";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "refresh_test";

describe("BookingService", () => {
  it("rejects conflicting bookings", async () => {
    const repo = {
      create: vi.fn(),
      findById: vi.fn(),
      cancel: vi.fn(),
      list: vi.fn()
    };
    const conflictService = {
      checkConflict: vi.fn().mockResolvedValue(true)
    };
    const eventBus = {
      publish: vi.fn().mockResolvedValue(undefined)
    };

    const { BookingService } = await import("../src/services/booking.service.js");
    const service = new BookingService({ repo: repo as any, conflictService: conflictService as any, eventBus: eventBus as any });

    await expect(
      service.create({ resourceId: "r1", startTime: new Date().toISOString(), endTime: new Date(Date.now() + 3600000).toISOString() }, { id: "u1", role: "STUDENT" })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("lists bookings with pagination", async () => {
    const repo = {
      list: vi.fn().mockResolvedValue({ items: [], total: 0 }),
      create: vi.fn(),
      findById: vi.fn(),
      cancel: vi.fn()
    };
    const conflictService = { checkConflict: vi.fn().mockResolvedValue(false) };
    const eventBus = { publish: vi.fn().mockResolvedValue(undefined) };

    const { BookingService } = await import("../src/services/booking.service.js");
    const service = new BookingService({ repo: repo as any, conflictService: conflictService as any, eventBus: eventBus as any });

    const result = await service.list({ page: "2", pageSize: "10" }, { id: "u1", role: "STUDENT" });
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(10);
    expect(repo.list).toHaveBeenCalledTimes(1);
  });
});
