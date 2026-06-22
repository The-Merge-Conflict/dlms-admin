// src/types/vocabularies.ts
// Matches DLMS backend VocabularyDto + Vocabularies endpoints.
// NOTE: the backend does NOT have a "comment" field on vocabularies.
export interface VocabularyDto {
  id: number;
  label: string;
  prefix: string; // e.g. "dcterms"
  namespaceUri: string; // e.g. "http://purl.org/dc/terms/"
}

// POST /api/vocabularies -> binds CreateVocabularyCommand
export interface CreateVocabularyCommand {
  label: string;
  prefix: string;
  namespaceUri: string;
}

// PUT /api/vocabularies/{id} -> binds UpdateVocabularyRequest record
export interface UpdateVocabularyRequest {
  label: string;
  prefix: string;
  namespaceUri: string;
}

// All create endpoints return { id: number } (CreatedAtAction with new { id }).
export interface CreatedResponse {
  id: number;
}

// Backwards-compatible alias for older imports. Prefer CreatedResponse.
export type CreateVocabularyResponse = CreatedResponse;
