import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource", required: true, index: true },
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    startTime: { type: Date, required: true, index: true },
    endTime: { type: Date, required: true, index: true },
    purpose: { type: String },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      default: "PENDING",
      index: true
    },
    approvalReason: { type: String }
  },
  { timestamps: true }
);

bookingSchema.index({ resourceId: 1, startTime: 1, endTime: 1, status: 1 });

export const BookingModel = mongoose.model("Booking", bookingSchema);
