// src/lib/validations/vocabulary.schema.ts
// FIXED: removed the "comment" field — the DLMS backend vocabulary payload only
// accepts { label, prefix, namespaceUri }.
import { z } from 'zod';

export const vocabularySchema = z.object({
  label: z
    .string()
    .min(1, 'Label is required')
    .max(200, 'Label must be at most 200 characters'),
  prefix: z
    .string()
    .min(1, 'Prefix is required')
    .max(20, 'Prefix must be at most 20 characters')
    .regex(
      /^[a-z][a-z0-9]*$/,
      'Prefix must be lowercase, start with a letter, and contain only letters/numbers',
    ),
  namespaceUri: z.string().url('Namespace URI must be a valid URL'),
});

export type VocabularyFormValues = z.infer<typeof vocabularySchema>;
