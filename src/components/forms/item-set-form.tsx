'use client';
// src/components/forms/item-set-form.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { itemSetSchema, ItemSetFormValues } from '@/lib/validations/item-set.schema';
import { useCreateItemSet, useUpdateItemSet } from '@/lib/hooks/use-item-sets';
import { ItemSetDto } from '@/types/item-sets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  existing?: ItemSetDto;
}

export function ItemSetForm({ existing }: Props) {
  const router = useRouter();
  const createMutation = useCreateItemSet();
  const updateMutation = useUpdateItemSet(existing?.id ?? 0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemSetFormValues>({
    resolver: zodResolver(itemSetSchema),
    defaultValues: existing
      ? {
          title: existing.title,
          description: existing.description,
          isPublic: existing.isPublic,
        }
      : { title: '', description: '', isPublic: false },
  });

  async function onSubmit(values: ItemSetFormValues) {
    const payload = {
      title: values.title,
      description: values.description ?? '',
      isPublic: values.isPublic,
    };
    if (existing) {
      await updateMutation.mutateAsync(payload);
      router.push(`/dashboard/item-sets/${existing.id}`);
    } else {
      const { id } = await createMutation.mutateAsync(payload);
      router.push(`/dashboard/item-sets/${id}`);
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>{existing ? 'Edit Item Set' : 'New Item Set'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register('title')} placeholder="Classic Literature" />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              {...register('description')}
              placeholder="A collection of classic books"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isPublic"
              type="checkbox"
              className="h-4 w-4 rounded border-input"
              {...register('isPublic')}
            />
            <Label htmlFor="isPublic">Public collection</Label>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : existing ? 'Update' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/item-sets')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
