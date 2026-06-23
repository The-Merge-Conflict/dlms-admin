// src/lib/validations/item.schema.ts
import { z } from 'zod';

// A template is mandatory for every item.
export const itemSchema = z.object({
  templateId: z.coerce
    .number({ error: 'A template is required' })
    .int()
    .positive('Please select a template'),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
