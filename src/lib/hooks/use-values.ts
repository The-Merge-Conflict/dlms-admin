// src/lib/hooks/use-values.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { valuesApi } from '@/lib/api/values';
import { AddValueRequest, UpdateValueRequest } from '@/types/values';
import { itemKeys } from './use-items';

export const valueKeys = {
  all: ['values'] as const,
  byResource: (resourceId: number) => ['values', 'by-resource', resourceId] as const,
  detail: (id: number) => ['values', id] as const,
};

export function useValuesByResource(resourceId: number) {
  return useQuery({
    queryKey: valueKeys.byResource(resourceId),
    queryFn: () => valuesApi.getByResource(resourceId),
    enabled: !!resourceId,
  });
}

export function useAddValue(resourceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AddValueRequest) => valuesApi.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: valueKeys.byResource(resourceId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(resourceId) });
    },
  });
}

export function useUpdateValue(resourceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: UpdateValueRequest }) =>
      valuesApi.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: valueKeys.byResource(resourceId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(resourceId) });
    },
  });
}

export function useDeleteValue(resourceId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => valuesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: valueKeys.byResource(resourceId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(resourceId) });
    },
  });
}
