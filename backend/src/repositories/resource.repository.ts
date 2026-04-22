import { prisma } from "../config/prisma.js";
import { Prisma } from "@prisma/client";

export type ResourceCreateInput = {
  name: string;
  type: "CLASSROOM" | "LABORATORY" | "EQUIPMENT";
  location: string;
  capacity: number;
  attributes?: Prisma.InputJsonValue | null;
};

export class ResourceRepository {
  async list() {
    return prisma.resource.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findById(id: string) {
    return prisma.resource.findUnique({ where: { id } });
  }

  async create(data: ResourceCreateInput) {
    return prisma.resource.create({
      data: {
        ...data,
        attributes: typeof data.attributes === "undefined" ? undefined : data.attributes
      }
    });
  }
}
