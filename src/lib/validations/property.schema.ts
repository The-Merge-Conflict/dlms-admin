// src/lib/validations/property.schema.ts
import { z } from 'zod';

export const propertySchema = z.object({
  // Zod 4 removed `invalid_type_error`/`required_error` in favor of a single
  // unified `error` param (string or function).
  vocabularyId: z.coerce
    .number({ error: 'Select a vocabulary' })
    .int()
    .positive('Select a vocabulary'),
  localName: z
    .string()
    .min(1, 'Local name is required')
    .max(200, 'Local name must be at most 200 characters'),
  label: z
    .string()
    .min(1, 'Label is required')
    .max(200, 'Label must be at most 200 characters'),
  termUri: z.string().url('Term URI must be a valid URL'),
});

// Input = the raw shape the form fields hold before Zod coercion
// (e.g. the <select> emits a string that `z.coerce.number` turns into a number).
export type PropertyFormInput = z.input<typeof propertySchema>;
// Output = the validated/coerced values handed to onSubmit.
export type PropertyFormValues = z.output<typeof propertySchema>;