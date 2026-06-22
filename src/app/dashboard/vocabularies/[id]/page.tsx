// src/app/dashboard/vocabularies/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import { useVocabulary } from '@/lib/hooks/use-vocabularies';
import { VocabularyForm } from '@/components/forms/vocabulary-form';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditVocabularyPage() {
  // 1. Grab the "id" from the URL (e.g., /vocabularies/5 -> id is "5")
  const params = useParams();
  const id = Number(params.id);

  // 2. Ask TanStack Query to fetch this specific vocabulary from C#
  const { data, isLoading, error } = useVocabulary(id);

  // 3. While waiting for the API, show a loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-4 max-w-lg">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-75 w-full" />
      </div>
    );
  }

  // 4. If the C# API returns an error (like 404 Not Found)
  if (error || !data) {
    return <p className="text-destructive">Error loading vocabulary. It may have been deleted.</p>;
  }

  // 5. If we have the data, pass it into the Form we built earlier!
  // Because we pass the `existing` prop, the Form will automatically switch
  // from "Create Mode" to "Update Mode".
  return (
    <div className="space-y-4">
      <VocabularyForm existing={data} />
    </div>
  );
}