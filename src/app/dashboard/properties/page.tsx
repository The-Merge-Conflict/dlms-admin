'use client';
// src/app/dashboard/properties/page.tsx
// Backend GET /api/properties is paginated + searchable.
import { useState } from 'react';
import Link from 'next/link';
import { useProperties, useDeleteProperty } from '@/lib/hooks/use-properties';
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

export default function PropertiesPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useProperties(page, 10, search);
  const deleteMutation = useDeleteProperty();

  function applySearch() {
    setSearch(searchInput.trim());
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Button asChild>
          <Link href="/dashboard/properties/new">
            <Plus size={16} className="mr-2" /> Add Property
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Search properties…"
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
        <p className="text-destructive">Failed to load properties.</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-muted-foreground">No properties found.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Local Name</TableHead>
                <TableHead>Vocabulary</TableHead>
                <TableHead>Term URI</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((prop) => (
                <TableRow key={prop.id}>
                  <TableCell className="font-medium">{prop.label}</TableCell>
                  <TableCell className="text-sm">{prop.localName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{prop.vocabularyLabel}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate max-w-xs">
                    {prop.termUri}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/properties/${prop.id}`}>
                          <Pencil size={14} />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Delete this property?')) {
                            deleteMutation.mutate(prop.id);
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
