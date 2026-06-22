'use client';
// src/app/dashboard/items/page.tsx
// Backend GET /api/items is paginated (page, pageSize), filterable by templateId,
// and searchable (search). This page mirrors the item-sets list conventions.
import { useState } from 'react';
import Link from 'next/link';
import { useItems, useDeleteItem } from '@/lib/hooks/use-items';
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
import { Trash2, Settings2, Plus, Search } from 'lucide-react';

export default function ItemsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useItems(page, 10, undefined, search);
  const deleteMutation = useDeleteItem();

  function applySearch() {
    setSearch(searchInput.trim());
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Items</h1>
        <Button asChild>
          <Link href="/dashboard/items/new">
            <Plus size={16} className="mr-2" /> Add Item
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Search items…"
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
        <p className="text-destructive">Failed to load items.</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-muted-foreground">No items found.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Values</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">#{item.id}</TableCell>
                  <TableCell>
                    {item.templateLabel ? (
                      <Badge variant="secondary">{item.templateLabel}</Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">No template</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.values?.length ?? 0}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.medias?.length ?? 0}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/items/${item.id}`}>
                          <Settings2 size={14} />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Delete this item?')) {
                            deleteMutation.mutate(item.id);
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
