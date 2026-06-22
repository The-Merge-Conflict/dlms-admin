// src/lib/hooks/use-properties.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesApi } from '@/lib/api/properties';
import { CreatePropertyCommand, UpdatePropertyRequest } from '@/types/properties';

export const propertyKeys = {
  all: ['properties'] as const,
  list: (page: number, pageSize: number, search?: string) =>
    ['properties', 'list', page, pageSize, search ?? null] as const,
  byVocabulary: (vocabularyId: number) =>
    ['properties', 'by-vocabulary', vocabularyId] as const,
  detail: (id: number) => ['properties', id] as const,
};

// Paginated + searchable list.
export function useProperties(page = 1, pageSize = 10, search?: string) {
  return useQuery({
    queryKey: propertyKeys.list(page, pageSize, search),
    queryFn: () => propertiesApi.getAll(page, pageSize, search),
  });
}

// Non-paginated helper used to populate dropdowns scoped to one vocabulary.
export function usePropertiesByVocabulary(vocabularyId: number) {
  return useQuery({
    queryKey: propertyKeys.byVocabulary(vocabularyId),
    queryFn: () => propertiesApi.getByVocabulary(vocabularyId),
    enabled: !!vocabularyId,
  });
}

export function useProperty(id: number) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: () => propertiesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: CreatePropertyCommand) => propertiesApi.create(command),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: propertyKeys.all }),
  });
}

export function useUpdateProperty(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdatePropertyRequest) => propertiesApi.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.all });
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(id) });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => propertiesApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: propertyKeys.all }),
  });
}
