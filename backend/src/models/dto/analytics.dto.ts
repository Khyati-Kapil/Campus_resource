import { z } from "zod";

export const usageQuerySchema = z.object({
  query: z.object({
    from: z.string().optional(),
    to: z.string().optional()
  })
});
