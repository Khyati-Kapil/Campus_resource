import { BookingModel } from "../models/Booking.js";

export const hasConflict = async (resourceId: string, startTime: Date, endTime: Date) => {
  const conflict = await BookingModel.findOne({
    resourceId,
    status: { $in: ["PENDING", "APPROVED"] },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  });
  return Boolean(conflict);
};
