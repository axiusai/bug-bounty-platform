import type { ApiContext } from "@/shared/types";
import { ForbiddenError } from "@/shared/errors";

/**
 * Ensures user has platform admin role.
 */
export function requireAdmin(ctx: ApiContext): void {
  if (ctx.role !== "platform_admin") {
    throw new ForbiddenError("Platform admin access required");
  }
}
