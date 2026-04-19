import { z } from "zod";

export const listAuditLogsSchema = z.object({
  query: z.object({
    entityType: z.string().optional(),
    entityId: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().max(100).optional()
  })
});
