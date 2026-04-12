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
    comment: z.string().optional()
  })
});
