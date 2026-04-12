import { prisma } from "../config/prisma.js";

export type ResourceCreateInput = {
  name: string;
  type: "CLASSROOM" | "LABORATORY" | "EQUIPMENT";
  location: string;
  capacity: number;
  attributes?: Record<string, unknown> | null;
};

export class ResourceRepository {
  async list() {
    return prisma.resource.findMany({ orderBy: { createdAt: "desc" } });
  }

  async create(data: ResourceCreateInput) {
    return prisma.resource.create({ data });
  }
}
