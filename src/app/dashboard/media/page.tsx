'use client';
// src/app/dashboard/media/page.tsx
// The backend exposes media only per-item (GET /api/media/by-item/{itemId}),
// so the gallery lets you pick an item and then manage its media.
import { useState } from 'react';
import { useItems } from '@/lib/hooks/use-items';
import { MediaPanel } from '@/components/media-panel';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const selectClass =
  'flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm';

export default function MediaPage() {
  const { data, isLoading } = useItems(1, 100);
  const [itemId, setItemId] = useState(0);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Media Gallery</h1>
      <p className="text-sm text-muted-foreground">
        Media is attached to items. Choose an item to view, upload, or remove its
        media files.
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

      {itemId > 0 && <MediaPanel itemId={itemId} />}
    </div>
  );
}
