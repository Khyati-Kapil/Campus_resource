import { AppError } from "../utils/app-error.js";
import { eventBus as defaultEventBus } from "../events/event-bus.js";
import { BookingEvents } from "../events/booking.events.js";
import { BookingRepository } from "../repositories/booking.repository.js";
import { ConflictDetectionService } from "./conflict-detection.service.js";
import { ResourceRepository } from "../repositories/resource.repository.js";
import { ApprovalPolicyService } from "./approval-policy.service.js";

type EventBusLike = { publish: (event: { type: string; payload: Record<string, unknown>; occurredAt: Date }) => Promise<void> };

export class BookingService {
  private repo: BookingRepository;
  private conflictService: ConflictDetectionService;
  private resourceRepo: ResourceRepository;
  private policyService: ApprovalPolicyService;
  private eventBus: EventBusLike;

  constructor(deps?: {
    repo?: BookingRepository;
    conflictService?: ConflictDetectionService;
    resourceRepo?: ResourceRepository;
    policyService?: ApprovalPolicyService;
    eventBus?: EventBusLike;
  }) {
    this.repo = deps?.repo ?? new BookingRepository();
    this.conflictService = deps?.conflictService ?? new ConflictDetectionService();
    this.resourceRepo = deps?.resourceRepo ?? new ResourceRepository();
    this.policyService = deps?.policyService ?? new ApprovalPolicyService();
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

    const resource = await this.resourceRepo.findById(String(payload.resourceId));
    if (!resource) {
      throw new AppError(404, "NOT_FOUND", "Resource not found");
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
      status: "PENDING",
      purpose: payload.purpose ? String(payload.purpose) : null
    });

    await this.eventBus.publish({
      type: BookingEvents.CREATED,
      payload: booking,
      occurredAt: new Date()
    });

    const approvalMode = this.policyService.evaluate({ type: resource.type }, startTime, user.role);
    if (approvalMode === "AUTO") {
      const approved = await this.repo.updateStatus(booking.id, "APPROVED", booking.version);
      await this.eventBus.publish({
        type: BookingEvents.APPROVED,
        payload: { booking: approved, approverId: user.id, comment: "AUTO_APPROVED" },
        occurredAt: new Date()
      });
      return approved;
    }

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

    if (from && Number.isNaN(from.getTime())) {
      throw new AppError(400, "VALIDATION_ERROR", "Invalid from date");
    }

    if (to && Number.isNaN(to.getTime())) {
      throw new AppError(400, "VALIDATION_ERROR", "Invalid to date");
    }

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
