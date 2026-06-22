// src/lib/hooks/use-resource-templates.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resourceTemplatesApi } from '@/lib/api/resource-templates';
import {
  CreateResourceTemplateCommand,
  UpdateResourceTemplateRequest,
  AddPropertyRequest,
  UpdateTemplatePropertyRequest,
} from '@/types/resource-templates';

export const templateKeys = {
  all: ['resource-templates'] as const,
  list: (page: number, pageSize: number, search?: string) =>
    ['resource-templates', 'list', page, pageSize, search ?? null] as const,
  detail: (id: number) => ['resource-templates', id] as const,
};

// Paginated + searchable list.
export function useResourceTemplates(page = 1, pageSize = 10, search?: string) {
  return useQuery({
    queryKey: templateKeys.list(page, pageSize, search),
    queryFn: () => resourceTemplatesApi.getAll(page, pageSize, search),
  });
}

export function useResourceTemplate(id: number) {
  return useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => resourceTemplatesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateResourceTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: CreateResourceTemplateCommand) =>
      resourceTemplatesApi.create(command),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: templateKeys.all }),
  });
}

export function useUpdateResourceTemplate(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateResourceTemplateRequest) =>
      resourceTemplatesApi.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.all });
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(id) });
    },
  });
}

export function useDeleteResourceTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => resourceTemplatesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: templateKeys.all }),
  });
}

// --- Template <-> property link management ---
export function useAddTemplateProperty(templateId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddPropertyRequest) =>
      resourceTemplatesApi.addProperty(templateId, request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(templateId) }),
  });
}

export function useUpdateTemplateProperty(templateId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      propertyId,
      request,
    }: {
      propertyId: number;
      request: UpdateTemplatePropertyRequest;
    }) => resourceTemplatesApi.updateProperty(templateId, propertyId, request),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(templateId) }),
  });
}

export function useRemoveTemplateProperty(templateId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (propertyId: number) =>
      resourceTemplatesApi.removeProperty(templateId, propertyId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(templateId) }),
  });
}
