'use client';
// src/app/dashboard/media/upload/page.tsx
// Dedicated upload screen. The backend attaches media to an item
// (POST /api/media with { itemId, altText?, file }), so we pick an item first
// and then reuse the MediaPanel dropzone to upload and review files.
import { useState } from 'react';
import Link from 'next/link';
import { useItems } from '@/lib/hooks/use-items';
import { MediaPanel } from '@/components/media-panel';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';

const selectClass =
  'flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

export default function UploadMediaPage() {
  // Pull a large page so the item picker isn't truncated by pagination.
  const { data, isLoading } = useItems(1, 200);
  const [itemId, setItemId] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Upload Media</h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/media">
            <ArrowLeft size={16} className="mr-2" /> Back to gallery
          </Link>
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Select the item the files belong to, then drag &amp; drop or click to
        upload. Media is stored against that item.
      </p>

      {isLoading ? (
        <Skeleton className="h-10 w-full max-w-md" />
      ) : (
        <div className="space-y-1">
          <Label htmlFor="item">Item</Label>
          <select
            id="item"
            className={selectClass}
            value={itemId}
            onChange={(e) => setItemId(Number(e.target.value))}
          >
            <option value={0}>Select an item…</option>
            {(data?.items ?? []).map((i) => (
              <option key={i.id} value={i.id}>
                #{i.id} — {i.templateLabel || 'No template'}
              </option>
            ))}
          </select>
        </div>
      )}

      {itemId > 0 ? (
        <MediaPanel itemId={itemId} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Choose an item above to start uploading.
        </p>
      )}
    </div>
  );
}