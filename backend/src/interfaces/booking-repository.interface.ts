export type BookingStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type BookingRecord = {
  id: string;
  resourceId: string;
  requesterId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  version: number;
};

export interface BookingRepositoryInterface {
  create(data: Omit<BookingRecord, "id" | "version">): Promise<BookingRecord>;
  findById(id: string): Promise<BookingRecord | null>;
  findOverlaps(resourceId: string, start: Date, end: Date, statuses: BookingStatus[]): Promise<BookingRecord[]>;
  list(filters: {
    status?: BookingStatus;
    resourceId?: string;
    requesterId?: string;
    from?: Date;
    to?: Date;
    skip?: number;
    take?: number;
  }): Promise<{ items: BookingRecord[]; total: number }>;
  updateStatus(id: string, status: BookingStatus, version: number): Promise<BookingRecord>;
  cancel(id: string, reason: string, version: number): Promise<BookingRecord>;
}
