export type Role = "STUDENT" | "FACULTY" | "ADMIN";
export type ResourceType = "CLASSROOM" | "LABORATORY" | "EQUIPMENT";
export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type LoadState = "idle" | "loading" | "loaded" | "error";

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthPayload {
  user: UserSummary;
  accessToken: string;
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  location: string;
  capacity: number;
}

export interface Booking {
  id: string;
  resourceId: string;
  requesterId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  purpose?: string | null;
  approvalReason?: string | null;
}

export interface NotificationRecord {
  id: string;
  type: string;
  message?: string;
  status: string;
  createdAt: string;
}

export interface AuditRecord {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  createdAt: string;
  actorId: string;
}

export interface UsageData {
  totalBookings: number;
  approvedBookings: number;
  pendingApprovals: number;
  conflicts: number;
  utilizationRate: number;
  peakHours: Array<{ hour: string; count: number }>;
}
