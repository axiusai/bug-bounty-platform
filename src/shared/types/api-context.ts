import type { UserId, OrgId } from "./common";

export type UserRole = "hacker" | "org_admin" | "platform_admin";

/**
 * Context passed from route handlers to services.
 * Populated by auth middleware.
 */
export type ApiContext = {
  userId: UserId;
  orgId?: OrgId;
  role: UserRole;
};
