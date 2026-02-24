import type { ApiContext } from "@/shared/types";
import { ForbiddenError } from "@/shared/errors";

/**
 * Ensures user has passed email verification.
 * Call after requireAuth - accepts ctx from auth.
 * Throws if email_verified is false (check user metadata or profile).
 */
export function requireVerifiedUser(ctx: ApiContext, emailVerified: boolean): void {
  if (!emailVerified) {
    throw new ForbiddenError("Email verification required");
  }
}
