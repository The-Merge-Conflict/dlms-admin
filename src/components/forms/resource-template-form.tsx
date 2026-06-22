'use client';
// src/components/forms/resource-template-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  resourceTemplateSchema,
  ResourceTemplateFormInput,
  ResourceTemplateFormValues,
} from '@/lib/validations/resource-template.schema';
import {
  useCreateResourceTemplate,
  useUpdateResourceTemplate,
} from '@/lib/hooks/use-resource-templates';
import { ResourceTemplateDto } from '@/types/resource-templates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  existing?: ResourceTemplateDto;
}

export function ResourceTemplateForm({ existing }: Props) {
  const router = useRouter();
  const createMutation = useCreateResourceTemplate();
  const updateMutation = useUpdateResourceTemplate(existing?.id ?? 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // 3 generics: <Input, Context, TransformedOutput>. Input has an optional
    // description; output guarantees a string (from `.default('')`).
  } = useForm<ResourceTemplateFormInput, unknown, ResourceTemplateFormValues>({
    resolver: zodResolver(resourceTemplateSchema),
    defaultValues: existing
      ? { label: existing.label, description: existing.description }
      : { label: '', description: '' },
  });

  async function onSubmit(values: ResourceTemplateFormValues) {
    const payload = { label: values.label, description: values.description };
    if (existing) {
      await updateMutation.mutateAsync(payload);
      router.push(`/dashboard/templates/${existing.id}`);
    } else {
      const { id } = await createMutation.mutateAsync(payload);
      // Send the user straight to the detail page so they can attach properties.
      router.push(`/dashboard/templates/${id}`);
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{existing ? 'Edit Template' : 'New Resource Template'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="label">Label</Label>
            <Input id="label" {...register('label')} placeholder="Book Template" />
            {errors.label && (
              <p className="text-sm text-destructive">{errors.label.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              {...register('description')}
              placeholder="Template for book items"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : existing ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/templates')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}