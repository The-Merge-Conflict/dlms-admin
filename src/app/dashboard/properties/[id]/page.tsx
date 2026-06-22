'use client';
// src/app/dashboard/properties/[id]/page.tsx
import { use } from 'react';
import { useProperty } from '@/lib/hooks/use-properties';
import { PropertyForm } from '@/components/forms/property-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data, isLoading, error } = useProperty(Number(id));

  if (isLoading) return <Skeleton className="h-64 w-full max-w-lg" />;
  if (error || !data) return <p className="text-destructive">Property not found.</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Property</h1>
      <PropertyForm existing={data} />
    </div>
  );
}
