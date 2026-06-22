// src/types/pagination.ts
// Mirrors DLMS.Application.Common.Models.PaginatedResult<T> from the C# backend.
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}
