import type { ApiContext } from "@/shared/types";
import { ForbiddenError } from "@/shared/errors";

/**
 * Ensures user is admin of the given organization.
 * Pass orgAdminIds or a check function from the caller.
 */
export function requireOrgAdmin(ctx: ApiContext, orgId: string, isAdmin: boolean): void {
  if (!isAdmin) {
    throw new ForbiddenError(`Not authorized to perform this action for organization ${orgId}`);
  }
}
