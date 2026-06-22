// src/types/values.ts
// Matches DLMS backend ValueDto + Values endpoints.
//
// IMPORTANT: the backend serializes a value's *type* differently on read vs write.
// - On READ (ValueDto.type) it is a STRING: "literal" | "uri" | "resource".
// - On WRITE (ValueInput.type / AddValue.valueType) it is the NUMERIC enum below.
export enum ValueType {
  Literal = 0,
  Uri = 1,
  Resource = 2,
}

// LanguageCode value object is serialized as { code: "en" }.
export interface LanguageInput {
  code: string;
}

export interface ValueDto {
  id: number;
  propertyId: number;
  propertyLabel: string;
  valueText: string | null;
  valueUri: string | null;
  valueResourceId: number | null;
  type: string; // "literal" | "uri" | "resource"
  language: string | null; // e.g. "en"
}

// Used inside Item create/update payloads (ValueInput on the backend).
export interface ValueInput {
  propertyId: number;
  valueText: string | null;
  valueUri: string | null;
  valueResourceId: number | null;
  type: ValueType;
  language: LanguageInput;
}

// POST /api/values
export interface AddValueRequest {
  resourceId: number;
  propertyId: number;
  valueText: string | null;
  valueUri: string | null;
  valueResourceId: number | null;
  valueType: ValueType;
  language: LanguageInput | null;
}

// PUT /api/values/{id}
export interface UpdateValueRequest {
  valueText: string | null;
  valueUri: string | null;
  valueResourceId: number | null;
  valueType: ValueType;
  language: LanguageInput | null;
}
