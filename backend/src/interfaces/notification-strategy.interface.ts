export type NotificationPayload = {
  userId: string;
  message: string;
  channel: "EMAIL" | "IN_APP";
};

export type NotificationResult = {
  sent: boolean;
  providerId?: string;
};

export interface NotificationStrategy {
  send(payload: NotificationPayload): Promise<NotificationResult>;
}
