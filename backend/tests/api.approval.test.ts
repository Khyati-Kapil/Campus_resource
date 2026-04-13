import express from "express";
import request from "supertest";
import { describe, it, expect, vi } from "vitest";
import { approveBookingHandler, rejectBookingHandler } from "../src/controllers/approval.controller.js";
import { validate } from "../src/middlewares/validation.middleware.js";
import { decisionSchema } from "../src/models/dto/booking.dto.js";

process.env.DATABASE_URL = process.env.DATABASE_URL ?? "mongodb://localhost:27017/test";
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "access_test";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "refresh_test";

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use((req, _res, next) => {
    req.user = { id: "u1", role: "ADMIN" };
    next();
  });
  return app;
};

describe("Approval API", () => {
  it("approves a booking", async () => {
    const service = {
      approve: vi.fn().mockResolvedValue({ status: "APPROVED" })
    };

    const app = buildApp();
    app.post("/approvals/:bookingId/approve", validate(decisionSchema), approveBookingHandler(service as any));

    const response = await request(app)
      .post("/approvals/b1/approve")
      .send({ comment: "ok" });

    expect(response.status).toBe(200);
    expect(service.approve).toHaveBeenCalledTimes(1);
  });

  it("rejects a booking", async () => {
    const service = {
      reject: vi.fn().mockResolvedValue({ status: "REJECTED" })
    };

    const app = buildApp();
    app.post("/approvals/:bookingId/reject", validate(decisionSchema), rejectBookingHandler(service as any));

    const response = await request(app)
      .post("/approvals/b1/reject")
      .send({ comment: "no" });

    expect(response.status).toBe(200);
    expect(service.reject).toHaveBeenCalledTimes(1);
  });
});
