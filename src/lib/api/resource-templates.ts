// src/lib/api/resource-templates.ts
// Backend: GET /api/resourcetemplates is paginated + searchable (page, pageSize, search).
import apiClient from './axios-client';
import {
  ResourceTemplateDto,
  CreateResourceTemplateCommand,
  UpdateResourceTemplateRequest,
  AddPropertyRequest,
  UpdateTemplatePropertyRequest,
} from '@/types/resource-templates';
import { CreatedResponse } from '@/types/vocabularies';
import { PaginatedResult } from '@/types/pagination';

export const resourceTemplatesApi = {
  getAll: async (
    page = 1,
    pageSize = 10,
    search?: string,
  ): Promise<PaginatedResult<ResourceTemplateDto>> => {
    const { data } = await apiClient.get<PaginatedResult<ResourceTemplateDto>>(
      '/resourcetemplates',
      { params: { page, pageSize, search: search || undefined } },
    );
    return data;
  },
  getById: async (id: number): Promise<ResourceTemplateDto> => {
    const { data } = await apiClient.get<ResourceTemplateDto>(`/resourcetemplates/${id}`);
    return data;
  },
  create: async (
    command: CreateResourceTemplateCommand,
  ): Promise<CreatedResponse> => {
    const { data } = await apiClient.post<CreatedResponse>('/resourcetemplates', command);
    return data;
  },
  update: async (
    id: number,
    request: UpdateResourceTemplateRequest,
  ): Promise<void> => {
    await apiClient.put(`/resourcetemplates/${id}`, request);
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/resourcetemplates/${id}`);
  },
  addProperty: async (
    templateId: number,
    request: AddPropertyRequest,
  ): Promise<void> => {
    await apiClient.post(`/resourcetemplates/${templateId}/properties`, request);
  },
  updateProperty: async (
    templateId: number,
    propertyId: number,
    request: UpdateTemplatePropertyRequest,
  ): Promise<void> => {
    await apiClient.put(
      `/resourcetemplates/${templateId}/properties/${propertyId}`,
      request,
    );
  },
  removeProperty: async (templateId: number, propertyId: number): Promise<void> => {
    await apiClient.delete(`/resourcetemplates/${templateId}/properties/${propertyId}`);
  },
};
