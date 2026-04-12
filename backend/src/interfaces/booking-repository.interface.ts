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
  updateStatus(id: string, status: BookingStatus, version: number): Promise<BookingRecord>;
  cancel(id: string, reason: string, version: number): Promise<BookingRecord>;
}
