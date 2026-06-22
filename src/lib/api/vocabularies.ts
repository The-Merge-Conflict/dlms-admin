// src/lib/api/vocabularies.ts
// Backend: GET /api/vocabularies is paginated + searchable (page, pageSize, search).
import apiClient from './axios-client';
import {
  VocabularyDto,
  CreateVocabularyCommand,
  UpdateVocabularyRequest,
  CreatedResponse,
} from '@/types/vocabularies';
import { PaginatedResult } from '@/types/pagination';

export const vocabulariesApi = {
  getAll: async (
    page = 1,
    pageSize = 10,
    search?: string,
  ): Promise<PaginatedResult<VocabularyDto>> => {
    const { data } = await apiClient.get<PaginatedResult<VocabularyDto>>('/vocabularies', {
      // Axios turns this into ?page=1&pageSize=10&search=...
      params: { page, pageSize, search: search || undefined },
    });
    return data;
  },
  getById: async (id: number): Promise<VocabularyDto> => {
    const { data } = await apiClient.get<VocabularyDto>(`/vocabularies/${id}`);
    return data;
  },
  create: async (command: CreateVocabularyCommand): Promise<CreatedResponse> => {
    // C# returns CreatedAtAction(..., new { id }) => { id: number }.
    const { data } = await apiClient.post<CreatedResponse>('/vocabularies', command);
    return data;
  },
  update: async (id: number, request: UpdateVocabularyRequest): Promise<void> => {
    // C# returns NoContent(), so we don't expect any data back.
    await apiClient.put(`/vocabularies/${id}`, request);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vocabularies/${id}`);
  },
};
