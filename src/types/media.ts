// src/types/media.ts
// Matches DLMS backend MediaDto + Media endpoints.
export interface MediaDto {
  id: number;
  itemId: number;
  storagePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  altText: string;
  thumbnail?: string | null;
}
