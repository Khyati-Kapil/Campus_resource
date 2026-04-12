import { prisma } from "../config/prisma.js";

export type UserCreateInput = {
  name: string;
  email: string;
  passwordHash: string;
  role: "STUDENT" | "FACULTY" | "ADMIN";
  department?: string | null;
  externalId?: string | null;
};

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: UserCreateInput) {
    return prisma.user.create({ data });
  }
}
