import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "FACULTY", "STUDENT"], default: "STUDENT" }
  },
  { timestamps: true }
);

export const UserModel = mongoose.model("User", userSchema);
