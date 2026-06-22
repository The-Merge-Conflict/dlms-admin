// src/lib/hooks/use-media.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mediaApi } from '@/lib/api/media';
import { itemKeys } from './use-items';

export const mediaKeys = {
  all: ['media'] as const,
  byItem: (itemId: number) => ['media', 'by-item', itemId] as const,
};

export function useMediaByItem(itemId: number) {
  return useQuery({
    queryKey: mediaKeys.byItem(itemId),
    queryFn: () => mediaApi.getByItem(itemId),
    enabled: !!itemId,
  });
}

export function useUploadMedia(itemId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, altText }: { file: File; altText?: string }) =>
      mediaApi.upload(itemId, file, altText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.byItem(itemId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(itemId) });
    },
  });
}

export function useDeleteMedia(itemId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => mediaApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mediaKeys.byItem(itemId) });
      queryClient.invalidateQueries({ queryKey: itemKeys.detail(itemId) });
    },
  });
}
