// src/types/properties.ts
// Matches DLMS backend PropertyDto + Properties endpoints.
export interface PropertyDto {
  id: number;
  vocabularyId: number;
  vocabularyLabel: string;
  localName: string;
  label: string;
  termUri: string;
}

// POST /api/properties
export interface CreatePropertyCommand {
  vocabularyId: number;
  localName: string;
  label: string;
  termUri: string;
}

// PUT /api/properties/{id}  (vocabularyId is NOT updatable)
export interface UpdatePropertyRequest {
  localName: string;
  label: string;
  termUri: string;
}
