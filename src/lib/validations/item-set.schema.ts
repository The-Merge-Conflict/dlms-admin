// src/lib/validations/item-set.schema.ts
import { z } from 'zod';

export const itemSetSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be at most 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must be at most 1000 characters')
    .optional()
    .default(''),
  isPublic: z.boolean().default(false),
});

export type ItemSetFormValues = z.infer<typeof itemSetSchema>;
