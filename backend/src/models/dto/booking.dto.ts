import { z } from "zod";

export const createBookingSchema = z.object({
  body: z.object({
    resourceId: z.string().min(5),
    startTime: z.string(),
    endTime: z.string(),
    purpose: z.string().optional()
  })
});

export const cancelBookingSchema = z.object({
  params: z.object({
    id: z.string().min(5)
  })
});

export const decisionSchema = z.object({
  params: z.object({
    bookingId: z.string().min(5)
  }),
  body: z.object({
    comment: z.string().optional(),
    reason: z.string().optional()
  })
});

export const conflictCheckSchema = z.object({
  query: z.object({
    resourceId: z.string().min(5),
    startTime: z.string(),
    endTime: z.string()
  })
});

export const listBookingsSchema = z.object({
  query: z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELLED"]).optional(),
    resourceId: z.string().optional(),
    requesterId: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    page: z.coerce.number().int().positive().optional(),
    pageSize: z.coerce.number().int().positive().max(100).optional()
  })
});
