import { ResourceRepository } from "../repositories/resource.repository.js";
import { AppError } from "../utils/app-error.js";
import { Prisma } from "@prisma/client";

const repo = new ResourceRepository();

export class ResourceService {
  async list(query: Record<string, unknown>) {
    return { items: await repo.list(), filters: query };
  }

  async create(payload: Record<string, unknown>) {
    if (!payload?.name || !payload?.type || !payload?.location || !payload?.capacity) {
      throw new AppError(400, "VALIDATION_ERROR", "Missing resource fields");
    }

    return repo.create({
      name: String(payload.name),
      type: String(payload.type) as "CLASSROOM" | "LABORATORY" | "EQUIPMENT",
      location: String(payload.location),
      capacity: Number(payload.capacity),
      attributes: (payload.attributes as Prisma.InputJsonValue) ?? null
    });
  }
}
