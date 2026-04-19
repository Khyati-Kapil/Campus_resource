import { Router } from "express";
import { requireAuth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/rbac.js";
import { BookingModel } from "../models/Booking.js";

export const analyticsRouter = Router();

analyticsRouter.get("/usage", requireAuth, requireRole("ADMIN"), async (_req, res, next) => {
  try {
    const [totalBookings, approvedBookings, pendingApprovals, conflicts] = await Promise.all([
      BookingModel.countDocuments(),
      BookingModel.countDocuments({ status: "APPROVED" }),
      BookingModel.countDocuments({ status: "PENDING" }),
      BookingModel.countDocuments({ status: "REJECTED" })
    ]);

    const hourAgg = await BookingModel.aggregate([
      { $project: { hour: { $hour: "$startTime" } } },
      { $group: { _id: "$hour", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 }
    ]);

    const peakHours = hourAgg.map((h) => ({ hour: String(h._id).padStart(2, "0"), count: h.count }));

    res.json({
      success: true,
      data: {
        totalBookings,
        approvedBookings,
        pendingApprovals,
        conflicts,
        utilizationRate: totalBookings ? approvedBookings / totalBookings : 0,
        peakHours
      }
    });
  } catch (error) {
    next(error);
  }
});
