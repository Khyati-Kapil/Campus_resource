import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    meta: { type: Object }
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model("Notification", notificationSchema);
