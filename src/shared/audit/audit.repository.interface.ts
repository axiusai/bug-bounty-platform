import type { CreateAuditLogInput } from "./audit.types";

export type IAuditRepository = {
  create(input: CreateAuditLogInput): Promise<void>;
};
