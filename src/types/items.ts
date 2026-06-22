// src/types/items.ts
// Matches DLMS backend ItemDto + Items endpoints.
import { MediaDto } from './media';
import { ValueDto, ValueInput } from './values';

export interface ItemDto {
  id: number;
  templateId: number | null;
  templateLabel: string;
  createdBy: string;
  createdAt: string; // ISO datetime
  values: ValueDto[];
  medias: MediaDto[]; // note: backend property is "medias"
}

// POST /api/items
export interface CreateItemRequest {
  templateId: number | null;
  values: ValueInput[];
}

// PUT /api/items/{id}
export interface UpdateItemRequest {
  templateId: number | null;
  values: ValueInput[];
}
