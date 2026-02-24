import type { NotificationService } from "./notification.interface";

/**
 * Development notification service - logs to console.
 * No real email/in-app delivery yet.
 */
export const consoleNotificationService: NotificationService = {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log("[Notification] sendEmail:", { to, subject, body });
  },

  async sendInAppNotification(userId: string, title: string, body: string): Promise<void> {
    console.log("[Notification] sendInApp:", { userId, title, body });
  },
};
