import { prisma } from "../config/prisma.js";

export class ApprovalRepository {
  async create(data: { bookingId: string; approverId: string; status: "APPROVED" | "REJECTED" | "PENDING"; comment?: string | null }) {
    return prisma.approval.create({ data: { ...data, decidedAt: new Date() } });
  }
}
