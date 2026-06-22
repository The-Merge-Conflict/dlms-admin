// src/lib/validations/resource-template.schema.ts
import { z } from 'zod';

export const resourceTemplateSchema = z.object({
  label: z
    .string()
    .min(1, 'Label is required')
    .max(200, 'Label must be at most 200 characters'),
  // `.optional().default('')` makes the INPUT type `description?: string`
  // but the OUTPUT type `description: string`. We expose both below so the
  // form can type its resolver correctly.
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional()
    .default(''),
});

// Input = form field shape (description optional before validation).
export type ResourceTemplateFormInput = z.input<typeof resourceTemplateSchema>;
// Output = validated values (description guaranteed to be a string).
export type ResourceTemplateFormValues = z.output<typeof resourceTemplateSchema>;