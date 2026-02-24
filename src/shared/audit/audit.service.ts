import type { ApiContext } from "@/shared/types";
import type { IAuditRepository } from "./audit.repository.interface";

/**
 * Audit logging service.
 * Called by domain services for critical operations.
 * Delegate implementation lives in infrastructure layer.
 */
export class AuditService {
  constructor(private readonly repository: IAuditRepository) {}

  async log(
    ctx: ApiContext,
    action: string,
    entity: string,
    entityId: string,
    metadata: Record<string, unknown> = {}
  ): Promise<void> {
    await this.repository.create({
      userId: ctx.userId,
      action,
      entity,
      entityId,
      metadata,
    });
  }
}
