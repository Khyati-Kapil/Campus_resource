import { AppError } from "../utils/app-error.js";
import { eventBus as defaultEventBus } from "../events/event-bus.js";
import { BookingEvents } from "../events/booking.events.js";
import { BookingRepository } from "../repositories/booking.repository.js";
import { ConflictDetectionService } from "./conflict-detection.service.js";

type EventBusLike = { publish: (event: { type: string; payload: Record<string, unknown>; occurredAt: Date }) => Promise<void> };

export class BookingService {
  private repo: BookingRepository;
  private conflictService: ConflictDetectionService;
  private eventBus: EventBusLike;

  constructor(deps?: {
    repo?: BookingRepository;
    conflictService?: ConflictDetectionService;
    eventBus?: EventBusLike;
  }) {
    this.repo = deps?.repo ?? new BookingRepository();
    this.conflictService = deps?.conflictService ?? new ConflictDetectionService();
    this.eventBus = deps?.eventBus ?? defaultEventBus;
  }

  async create(payload: Record<string, unknown>, user?: { id: string; role: string }) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Login required");
    }

    if (!payload?.resourceId || !payload?.startTime || !payload?.endTime) {
      throw new AppError(400, "VALIDATION_ERROR", "Missing booking fields");
    }

    const startTime = new Date(String(payload.startTime));
    const endTime = new Date(String(payload.endTime));

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      throw new AppError(400, "VALIDATION_ERROR", "Invalid start or end time");
    }

    if (startTime >= endTime) {
      throw new AppError(400, "VALIDATION_ERROR", "Start time must be before end time");
    }

    const hasConflict = await this.conflictService.checkConflict(String(payload.resourceId), startTime, endTime);
    if (hasConflict) {
      throw new AppError(409, "BOOKING_CONFLICT", "Requested slot overlaps an existing booking");
    }

    const booking = await this.repo.create({
      resourceId: String(payload.resourceId),
      requesterId: user.id,
      startTime,
      endTime,
      status: "PENDING"
    });

    await this.eventBus.publish({
      type: BookingEvents.CREATED,
      payload: booking,
      occurredAt: new Date()
    });

    return booking;
  }

  async list(query: Record<string, unknown>, user?: { id: string; role: string }) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Login required");
    }

    const page = Number(query.page ?? 1);
    const pageSize = Number(query.pageSize ?? 20);
    const skip = (page - 1) * pageSize;

    const from = query.from ? new Date(String(query.from)) : undefined;
    const to = query.to ? new Date(String(query.to)) : undefined;

    const { items, total } = await this.repo.list({
      status: query.status as "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED" | undefined,
      resourceId: query.resourceId ? String(query.resourceId) : undefined,
      requesterId: query.requesterId ? String(query.requesterId) : undefined,
      from,
      to,
      skip,
      take: pageSize
    });

    return {
      items,
      total,
      page,
      pageSize
    };
  }

  async cancel(id: string, user?: { id: string; role: string }) {
    if (!user) {
      throw new AppError(401, "UNAUTHORIZED", "Login required");
    }

    if (!id) {
      throw new AppError(400, "VALIDATION_ERROR", "Booking id required");
    }

    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new AppError(404, "NOT_FOUND", "Booking not found");
    }

    if (existing.requesterId !== user.id && user.role !== "ADMIN") {
      throw new AppError(403, "FORBIDDEN", "Cannot cancel this booking");
    }

    const cancelled = await this.repo.cancel(id, "user_cancel", existing.version);

    await this.eventBus.publish({
      type: BookingEvents.CANCELLED,
      payload: cancelled,
      occurredAt: new Date()
    });

    return cancelled;
  }
}
