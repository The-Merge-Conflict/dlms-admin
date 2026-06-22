// src/types/item-sets.ts
// Matches DLMS backend ItemSetDto + ItemSets endpoints.
import { ItemDto } from './items';

export interface ItemSetDto {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string; // ISO datetime
  // The basic ItemSetDto does not always include members. The detail endpoint
  // (GET /api/itemsets/{id}) may include them; we read them optionally if present.
  items?: ItemDto[];
}

// POST /api/itemsets
export interface CreateItemSetCommand {
  title: string;
  description: string;
  isPublic: boolean;
}

// PUT /api/itemsets/{id}
export interface UpdateItemSetRequest {
  title: string;
  description: string;
  isPublic: boolean;
}
