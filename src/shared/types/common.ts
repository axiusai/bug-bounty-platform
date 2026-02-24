/**
 * Common types used across modules.
 */

export type UserId = string;
export type OrgId = string;
export type ProgramId = string;
export type ReportId = string;

export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
