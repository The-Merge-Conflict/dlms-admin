// src/lib/hooks/use-items.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemsApi } from '@/lib/api/items';
import { CreateItemRequest, UpdateItemRequest } from '@/types/items';

export const itemKeys = {
  all: ['items'] as const,
  list: (page: number, pageSize: number, templateId?: number, search?: string) =>
    ['items', 'list', page, pageSize, templateId ?? null, search ?? null] as const,
  detail: (id: number) => ['items', id] as const,
};

// Paginated, filterable by templateId, and searchable.
export function useItems(
  page = 1,
  pageSize = 10,
  templateId?: number,
  search?: string,
) {
  return useQuery({
    queryKey: itemKeys.list(page, pageSize, templateId, search),
    queryFn: () => itemsApi.getAll(page, pageSize, templateId, search),
  });
}

export function useItem(id: number) {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => itemsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateItemRequest) => itemsApi.create(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  });
}

export function useUpdateItem(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateItemRequest) => itemsApi.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemKeys.all });
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(id) });
    },
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => itemsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemKeys.all }),
  });
}
