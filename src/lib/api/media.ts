// src/lib/api/media.ts
import apiClient from './axios-client';
import { MediaDto } from '@/types/media';
import { CreatedResponse } from '@/types/vocabularies';

export const mediaApi = {
  getByItem: async (itemId: number): Promise<MediaDto[]> => {
    const { data } = await apiClient.get<MediaDto[]>(`/media/by-item/${itemId}`);
    return data;
  },

  upload: async (
    itemId: number,
    file: File,
    altText?: string,
  ): Promise<CreatedResponse> => {
    const formData = new FormData();
    formData.append('itemId', String(itemId));
    if (altText) formData.append('altText', altText);
    formData.append('file', file);

    const { data } = await apiClient.post<CreatedResponse>('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
  },
};

// Build a browser-usable URL for a stored media file. If the backend already
// returns an absolute URL we use it as-is; otherwise we prefix the API origin.
export function mediaUrl(storagePath: string): string {
  if (/^https?:\/\//i.test(storagePath)) return storagePath;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';
  const origin = base.replace(/\/?api\/?$/, '').replace(/\/$/, '');
  const path = storagePath.startsWith('/') ? storagePath : `/${storagePath}`;
  return `${origin}${path}`;
}
