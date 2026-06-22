'use client';
// src/app/dashboard/vocabularies/page.tsx
// Backend GET /api/vocabularies is paginated + searchable.
import { useState } from 'react';
import Link from 'next/link';
import { useVocabularies, useDeleteVocabulary } from '@/lib/hooks/use-vocabularies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Pencil, Plus, Search } from 'lucide-react';

export default function VocabulariesPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useVocabularies(page, 10, search);
  const deleteMutation = useDeleteVocabulary();

  function applySearch() {
    setSearch(searchInput.trim());
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Vocabularies</h1>
        <Button asChild>
          <Link href="/dashboard/vocabularies/new">
            <Plus size={16} className="mr-2" /> Add Vocabulary
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Search vocabularies…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applySearch()}
        />
        <Button variant="outline" onClick={applySearch}>
          <Search size={16} />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : error ? (
        <p className="text-destructive">Failed to load vocabularies.</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-muted-foreground">No vocabularies found.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Prefix</TableHead>
                <TableHead>Namespace URI</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((vocab) => (
                <TableRow key={vocab.id}>
                  <TableCell className="font-medium">{vocab.label}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{vocab.prefix}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate max-w-xs">
                    {vocab.namespaceUri}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/vocabularies/${vocab.id}`}>
                          <Pencil size={14} />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Delete this vocabulary?')) {
                            deleteMutation.mutate(vocab.id);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {data.totalPages > 1 && (
            <div className="flex gap-2 justify-end mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p - 1)}
                disabled={!data.hasPreviousPage}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground self-center px-4">
                Page {data.page} of {data.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!data.hasNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
