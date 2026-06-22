// src/lib/hooks/use-vocabularies.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vocabulariesApi } from '@/lib/api/vocabularies';
import {
  CreateVocabularyCommand,
  UpdateVocabularyRequest,
} from '@/types/vocabularies';

// Query keys — used to identify and invalidate cached data.
export const vocabularyKeys = {
  all: ['vocabularies'] as const,
  list: (page: number, pageSize: number, search?: string) =>
    ['vocabularies', 'list', page, pageSize, search ?? null] as const,
  detail: (id: number) => ['vocabularies', id] as const,
};

// Paginated + searchable list.
export function useVocabularies(page = 1, pageSize = 10, search?: string) {
  return useQuery({
    queryKey: vocabularyKeys.list(page, pageSize, search),
    queryFn: () => vocabulariesApi.getAll(page, pageSize, search),
  });
}

// Fetch a single vocabulary.
export function useVocabulary(id: number) {
  return useQuery({
    queryKey: vocabularyKeys.detail(id),
    queryFn: () => vocabulariesApi.getById(id),
    enabled: !!id, // only run when id is truthy
  });
}

export function useCreateVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: CreateVocabularyCommand) => vocabulariesApi.create(command),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.all });
    },
  });
}

export function useUpdateVocabulary(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateVocabularyRequest) => vocabulariesApi.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.all });
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.detail(id) });
    },
  });
}

export function useDeleteVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => vocabulariesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.all });
    },
  });
}
