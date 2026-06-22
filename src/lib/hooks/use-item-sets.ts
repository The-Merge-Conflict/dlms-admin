// src/lib/hooks/use-item-sets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { itemSetsApi } from '@/lib/api/item-sets';
import { CreateItemSetCommand, UpdateItemSetRequest } from '@/types/item-sets';

export const itemSetKeys = {
  all: ['item-sets'] as const,
  list: (page: number, pageSize: number, search?: string) =>
    ['item-sets', 'list', page, pageSize, search ?? null] as const,
  detail: (id: number) => ['item-sets', id] as const,
};

// Paginated + searchable list.
export function useItemSets(page = 1, pageSize = 10, search?: string) {
  return useQuery({
    queryKey: itemSetKeys.list(page, pageSize, search),
    queryFn: () => itemSetsApi.getAll(page, pageSize, search),
  });
}

export function useItemSet(id: number) {
  return useQuery({
    queryKey: itemSetKeys.detail(id),
    queryFn: () => itemSetsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateItemSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (command: CreateItemSetCommand) => itemSetsApi.create(command),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemSetKeys.all }),
  });
}

export function useUpdateItemSet(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: UpdateItemSetRequest) => itemSetsApi.update(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemSetKeys.all });
      queryClient.invalidateQueries({ queryKey: itemSetKeys.detail(id) });
    },
  });
}

export function useDeleteItemSet() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => itemSetsApi.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemSetKeys.all }),
  });
}

export function useAddItemToSet(setId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => itemSetsApi.addItem(setId, itemId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: itemSetKeys.detail(setId) }),
  });
}

export function useRemoveItemFromSet(setId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => itemSetsApi.removeItem(setId, itemId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: itemSetKeys.detail(setId) }),
  });
}
