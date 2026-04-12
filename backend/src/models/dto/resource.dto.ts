import { z } from "zod";

export const createResourceSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: z.enum(["CLASSROOM", "LABORATORY", "EQUIPMENT"]),
    location: z.string().min(2),
    capacity: z.number().int().positive()
  })
});
