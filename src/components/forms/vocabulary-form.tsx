'use client';
// src/components/forms/vocabulary-form.tsx
// FIXED: dropped the unsupported "comment" field so the payload matches the
// backend ({ label, prefix, namespaceUri }).
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  vocabularySchema,
  VocabularyFormValues,
} from '@/lib/validations/vocabulary.schema';
import {
  useCreateVocabulary,
  useUpdateVocabulary,
} from '@/lib/hooks/use-vocabularies';
import { VocabularyDto } from '@/types/vocabularies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  existing?: VocabularyDto;
}

export function VocabularyForm({ existing }: Props) {
  const router = useRouter();
  const createMutation = useCreateVocabulary();
  const updateMutation = useUpdateVocabulary(existing?.id ?? 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VocabularyFormValues>({
    resolver: zodResolver(vocabularySchema),
    defaultValues: existing
      ? { label: existing.label, prefix: existing.prefix, namespaceUri: existing.namespaceUri }
      : { label: '', prefix: '', namespaceUri: '' },
  });

  async function onSubmit(values: VocabularyFormValues) {
    if (existing) {
      await updateMutation.mutateAsync(values);
    } else {
      await createMutation.mutateAsync(values);
    }
    router.push('/dashboard/vocabularies');
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{existing ? 'Edit Vocabulary' : 'New Vocabulary'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="label">Label</Label>
            <Input id="label" {...register('label')} placeholder="Dublin Core Terms" />
            {errors.label && (
              <p className="text-sm text-destructive">{errors.label.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="prefix">Prefix</Label>
            <Input id="prefix" {...register('prefix')} placeholder="dcterms" />
            {errors.prefix && (
              <p className="text-sm text-destructive">{errors.prefix.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="namespaceUri">Namespace URI</Label>
            <Input
              id="namespaceUri"
              {...register('namespaceUri')}
              placeholder="http://purl.org/dc/terms/"
            />
            {errors.namespaceUri && (
              <p className="text-sm text-destructive">{errors.namespaceUri.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : existing ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/vocabularies')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
