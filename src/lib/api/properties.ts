// src/lib/api/properties.ts
// Backend: GET /api/properties is paginated + searchable (page, pageSize, search).
//          GET /api/properties/by-vocabulary/{id} is NOT paginated (plain list).
import apiClient from './axios-client';
import {
  PropertyDto,
  CreatePropertyCommand,
  UpdatePropertyRequest,
} from '@/types/properties';
import { CreatedResponse } from '@/types/vocabularies';
import { PaginatedResult } from '@/types/pagination';

export const propertiesApi = {
  getAll: async (
    page = 1,
    pageSize = 10,
    search?: string,
  ): Promise<PaginatedResult<PropertyDto>> => {
    const { data } = await apiClient.get<PaginatedResult<PropertyDto>>('/properties', {
      params: { page, pageSize, search: search || undefined },
    });
    return data;
  },
  getByVocabulary: async (vocabularyId: number): Promise<PropertyDto[]> => {
    const { data } = await apiClient.get<PropertyDto[]>(
      `/properties/by-vocabulary/${vocabularyId}`,
    );
    return data;
  },
  getById: async (id: number): Promise<PropertyDto> => {
    const { data } = await apiClient.get<PropertyDto>(`/properties/${id}`);
    return data;
  },
  create: async (command: CreatePropertyCommand): Promise<CreatedResponse> => {
    const { data } = await apiClient.post<CreatedResponse>('/properties', command);
    return data;
  },
  update: async (id: number, request: UpdatePropertyRequest): Promise<void> => {
    await apiClient.put(`/properties/${id}`, request);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  },
};
