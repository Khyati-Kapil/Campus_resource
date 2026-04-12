export type ApprovalDecision = {
  status: "APPROVED" | "REJECTED" | "PENDING";
  comment?: string;
};

export type ApprovalContext = {
  bookingId: string;
  resourceType: string;
  requesterRole: string;
};

export interface ApprovalStrategy {
  execute(ctx: ApprovalContext): Promise<ApprovalDecision>;
}
