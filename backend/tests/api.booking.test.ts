import express from "express";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { createBookingHandler, listBookingsHandler } from "../src/controllers/booking.controller.js";
import { validate } from "../src/middlewares/validation.middleware.js";
import { createBookingSchema, listBookingsSchema } from "../src/models/dto/booking.dto.js";

process.env.DATABASE_URL = process.env.DATABASE_URL ?? "mongodb://localhost:27017/test";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "access_test";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "refresh_test";

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.user = { id: "u1", role: "STUDENT" };
    next();
  });
  return app;
};

describe("Booking API", () => {
  it("creates a booking", async () => {
    const service = {
      create: vi.fn().mockResolvedValue({ id: "b1" })
    };

    const app = buildApp();
    app.post("/bookings", validate(createBookingSchema), createBookingHandler(service as any));

    const response = await request(app)
      .post("/bookings")
      .send({ resourceId: "r1", startTime: new Date().toISOString(), endTime: new Date(Date.now() + 3600000).toISOString() });

    expect(response.status).toBe(201);
    expect(service.create).toHaveBeenCalledTimes(1);
  });

  it("lists bookings with query filters", async () => {
    const service = {
      list: vi.fn().mockResolvedValue({ items: [], total: 0, page: 1, pageSize: 20 })
    };

    const app = buildApp();
    app.get("/bookings", validate(listBookingsSchema), listBookingsHandler(service as any));

    const response = await request(app).get("/bookings?status=PENDING&page=1");

    expect(response.status).toBe(200);
    expect(service.list).toHaveBeenCalledTimes(1);
  });
});
