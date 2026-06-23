// src/types/item-sets.ts
// Matches DLMS backend ItemSetDto + ItemSets endpoints.
// A lightweight view of an item as it appears inside an item set's members list.
export interface ItemSetMemberDto {
  id: number;
  templateId: number | null;
  templateLabel: string;
  createdAt: string; // ISO datetime
}

export interface ItemSetDto {
  id: number;
  title: string;
  description: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string; // ISO datetime
  itemCount: number;
  // The detail endpoint (GET /api/itemsets/{id}) includes the set's members.
  items: ItemSetMemberDto[];
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
