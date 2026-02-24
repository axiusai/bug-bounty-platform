/**
 * Notification service abstraction.
 * Implementations: ConsoleNotificationService (dev), future Email/SMS.
 */
export type NotificationService = {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendInAppNotification(userId: string, title: string, body: string): Promise<void>;
};
