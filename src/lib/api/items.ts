// src/lib/api/items.ts
// Backend: GET /api/items is paginated (page, pageSize) + filterable by templateId
// and searchable (search).
import apiClient from './axios-client';
import { ItemDto, CreateItemRequest, UpdateItemRequest } from '@/types/items';
import { CreatedResponse } from '@/types/vocabularies';
import { PaginatedResult } from '@/types/pagination';

export const itemsApi = {
  getAll: async (
    page = 1,
    pageSize = 10,
    templateId?: number,
    search?: string,
  ): Promise<PaginatedResult<ItemDto>> => {
    const { data } = await apiClient.get<PaginatedResult<ItemDto>>('/items', {
      params: { page, pageSize, templateId: templateId ?? undefined, search: search || undefined },
    });
    return data;
  },
  getById: async (id: number): Promise<ItemDto> => {
    const { data } = await apiClient.get<ItemDto>(`/items/${id}`);
    return data;
  },
  create: async (request: CreateItemRequest): Promise<CreatedResponse> => {
    const { data } = await apiClient.post<CreatedResponse>('/items', request);
    return data;
  },
  update: async (id: number, request: UpdateItemRequest): Promise<void> => {
    await apiClient.put(`/items/${id}`, request);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/items/${id}`);
  },
};
