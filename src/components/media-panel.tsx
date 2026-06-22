'use client';
// src/components/media-panel.tsx
// Reusable panel that lists, uploads, and deletes media for a single item.
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMediaByItem, useUploadMedia, useDeleteMedia } from '@/lib/hooks/use-media';
import { mediaUrl } from '@/lib/api/media';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, UploadCloud } from 'lucide-react';

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaPanel({ itemId }: { itemId: number }) {
  const { data: media, isLoading } = useMediaByItem(itemId);
  const uploadMedia = useUploadMedia(itemId);
  const deleteMedia = useDeleteMedia(itemId);
  const [altText, setAltText] = useState('');

  const onDrop = useCallback(
    async (accepted: File[]) => {
      for (const file of accepted) {
        await uploadMedia.mutateAsync({ file, altText: altText || undefined });
      }
      setAltText('');
    },
    [uploadMedia, altText],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Media</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            placeholder="Alt text (optional, applied to next upload)"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
          />
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center rounded-md border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary bg-muted' : 'border-input'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="mb-2 h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {uploadMedia.isPending
                ? 'Uploading…'
                : 'Drag & drop files here, or click to select'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : !media || media.length === 0 ? (
          <p className="text-muted-foreground">No media attached yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {media.map((m) => (
              <div key={m.id} className="rounded-md border overflow-hidden">
                {m.mimeType?.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={mediaUrl(m.storagePath)}
                    alt={m.altText || m.fileName}
                    className="h-32 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-32 w-full items-center justify-center bg-muted text-xs text-muted-foreground">
                    {m.mimeType || 'file'}
                  </div>
                )}
                <div className="p-2 space-y-1">
                  <p className="truncate text-xs font-medium" title={m.fileName}>
                    {m.fileName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(m.fileSize)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      if (confirm('Delete this media file?')) {
                        deleteMedia.mutate(m.id);
                      }
                    }}
                  >
                    <Trash2 size={14} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
