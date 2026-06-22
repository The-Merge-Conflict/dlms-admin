'use client';
// src/app/dashboard/items/[id]/page.tsx
// Edit a single item. ItemForm handles both create and edit via the `existing` prop.
import { use } from 'react';
import { useItem } from '@/lib/hooks/use-items';
import { ItemForm } from '@/components/forms/item-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useItem(Number(id));

  if (isLoading) return <Skeleton className="h-96 w-full max-w-2xl" />;
  if (error || !data) return <p className="text-destructive">Item not found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Item</h1>
      <ItemForm existing={data} />
    </div>
  );
}
