'use client';
// src/components/forms/property-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  propertySchema,
  PropertyFormInput,
  PropertyFormValues,
} from '@/lib/validations/property.schema';
import { useCreateProperty, useUpdateProperty } from '@/lib/hooks/use-properties';
import { useVocabularies } from '@/lib/hooks/use-vocabularies';
import { PropertyDto } from '@/types/properties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  existing?: PropertyDto;
}

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

export function PropertyForm({ existing }: Props) {
  const router = useRouter();
  const createMutation = useCreateProperty();
  const updateMutation = useUpdateProperty(existing?.id ?? 0);
  // The list endpoint is paginated; pull a large page to populate the dropdown.
  const { data: vocabPage } = useVocabularies(1, 200);
  const vocabularies = vocabPage?.items ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // 3 generics: <Input, Context, TransformedOutput>. The resolver validates
    // the input shape and yields the coerced output shape to handleSubmit.
  } = useForm<PropertyFormInput, unknown, PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: existing
      ? {
          vocabularyId: existing.vocabularyId,
          localName: existing.localName,
          label: existing.label,
          termUri: existing.termUri,
        }
      : { vocabularyId: 0, localName: '', label: '', termUri: '' },
  });

  async function onSubmit(values: PropertyFormValues) {
    if (existing) {
      // vocabularyId is immutable on the backend update endpoint.
      await updateMutation.mutateAsync({
        localName: values.localName,
        label: values.label,
        termUri: values.termUri,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
    router.push('/dashboard/properties');
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{existing ? 'Edit Property' : 'New Property'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="vocabularyId">Vocabulary</Label>
            <select
              id="vocabularyId"
              className={selectClass}
              disabled={!!existing}
              {...register('vocabularyId')}
            >
              <option value={0}>Select a vocabulary…</option>
              {vocabularies.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label} ({v.prefix})
                </option>
              ))}
            </select>
            {existing && (
              <p className="text-xs text-muted-foreground">
                Vocabulary cannot be changed after creation.
              </p>
            )}
            {errors.vocabularyId && (
              <p className="text-sm text-destructive">{errors.vocabularyId.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="localName">Local Name</Label>
            <Input id="localName" {...register('localName')} placeholder="title" />
            {errors.localName && (
              <p className="text-sm text-destructive">{errors.localName.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="label">Label</Label>
            <Input id="label" {...register('label')} placeholder="Title" />
            {errors.label && (
              <p className="text-sm text-destructive">{errors.label.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="termUri">Term URI</Label>
            <Input
              id="termUri"
              {...register('termUri')}
              placeholder="http://purl.org/dc/elements/1.1/title"
            />
            {errors.termUri && (
              <p className="text-sm text-destructive">{errors.termUri.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : existing ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/properties')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}