import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["CLASSROOM", "LABORATORY", "EQUIPMENT"], required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const ResourceModel = mongoose.model("Resource", resourceSchema);
