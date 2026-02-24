import type { UserId } from "@/shared/types";

export type AuditLog = {
  id: string;
  userId: UserId;
  action: string;
  entity: string;
  entityId: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
};

export type CreateAuditLogInput = Omit<AuditLog, "id" | "timestamp">;
