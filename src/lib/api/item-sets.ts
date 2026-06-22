// src/lib/api/item-sets.ts
// Backend: GET /api/itemsets is paginated + searchable (page, pageSize, search).
import apiClient from './axios-client';
import {
  ItemSetDto,
  CreateItemSetCommand,
  UpdateItemSetRequest,
} from '@/types/item-sets';
import { CreatedResponse } from '@/types/vocabularies';
import { PaginatedResult } from '@/types/pagination';

export const itemSetsApi = {
  getAll: async (
    page = 1,
    pageSize = 10,
    search?: string,
  ): Promise<PaginatedResult<ItemSetDto>> => {
    const { data } = await apiClient.get<PaginatedResult<ItemSetDto>>('/itemsets', {
      params: { page, pageSize, search: search || undefined },
    });
    return data;
  },
  getById: async (id: number): Promise<ItemSetDto> => {
    const { data } = await apiClient.get<ItemSetDto>(`/itemsets/${id}`);
    return data;
  },
  create: async (command: CreateItemSetCommand): Promise<CreatedResponse> => {
    const { data } = await apiClient.post<CreatedResponse>('/itemsets', command);
    return data;
  },
  update: async (id: number, request: UpdateItemSetRequest): Promise<void> => {
    await apiClient.put(`/itemsets/${id}`, request);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/itemsets/${id}`);
  },
  addItem: async (id: number, itemId: number): Promise<void> => {
    await apiClient.post(`/itemsets/${id}/items/${itemId}`);
  },
  removeItem: async (id: number, itemId: number): Promise<void> => {
    await apiClient.delete(`/itemsets/${id}/items/${itemId}`);
  },
};
