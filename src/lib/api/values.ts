// src/lib/api/values.ts
import apiClient from './axios-client';
import { ValueDto, AddValueRequest, UpdateValueRequest } from '@/types/values';
import { CreatedResponse } from '@/types/vocabularies';

export const valuesApi = {
  getByResource: async (resourceId: number): Promise<ValueDto[]> => {
    const { data } = await apiClient.get<ValueDto[]>(`/values/by-resource/${resourceId}`);
    return data;
  },

  getById: async (id: number): Promise<ValueDto> => {
    const { data } = await apiClient.get<ValueDto>(`/values/${id}`);
    return data;
  },

  create: async (request: AddValueRequest): Promise<CreatedResponse> => {
    const { data } = await apiClient.post<CreatedResponse>('/values', request);
    return data;
  },

  update: async (id: number, request: UpdateValueRequest): Promise<void> => {
    await apiClient.put(`/values/${id}`, request);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/values/${id}`);
  },
};
