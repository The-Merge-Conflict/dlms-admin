// src/types/resource-templates.ts
// Matches DLMS backend ResourceTemplateDto / TemplatePropertyDto + endpoints.
export interface TemplatePropertyDto {
  propertyId: number;
  propertyLabel: string;
  termUri: string;
  isRequired: boolean;
  displayOrder: number;
  alternateLabel: string;
}

export interface ResourceTemplateDto {
  id: number;
  label: string;
  description: string;
  properties: TemplatePropertyDto[];
}

// POST /api/resourcetemplates
export interface CreateResourceTemplateCommand {
  label: string;
  description: string;
}

// PUT /api/resourcetemplates/{id}
export interface UpdateResourceTemplateRequest {
  label: string;
  description: string;
}

// POST /api/resourcetemplates/{id}/properties
export interface AddPropertyRequest {
  propertyId: number;
  isRequired: boolean;
  displayOrder: number;
  alternateLabel: string | null;
}

// PUT /api/resourcetemplates/{id}/properties/{propertyId}
export interface UpdateTemplatePropertyRequest {
  isRequired: boolean;
  displayOrder: number;
  alternateLabel: string | null;
}
