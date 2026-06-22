'use client';
// src/app/dashboard/templates/page.tsx
// Backend GET /api/resourcetemplates is paginated + searchable.
import { useState } from 'react';
import Link from 'next/link';
import {
  useResourceTemplates,
  useDeleteResourceTemplate,
} from '@/lib/hooks/use-resource-templates';
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

export default function TemplatesPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading, error } = useResourceTemplates(page, 10, search);
  const deleteMutation = useDeleteResourceTemplate();

  function applySearch() {
    setSearch(searchInput.trim());
    setPage(1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Resource Templates</h1>
        <Button asChild>
          <Link href="/dashboard/templates/new">
            <Plus size={16} className="mr-2" /> Add Template
          </Link>
        </Button>
      </div>

      <div className="flex gap-2 max-w-md">
        <Input
          placeholder="Search templates…"
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
        <p className="text-destructive">Failed to load templates.</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-muted-foreground">No templates found.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Label</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((tpl) => (
                <TableRow key={tpl.id}>
                  <TableCell className="font-medium">{tpl.label}</TableCell>
                  <TableCell className="text-muted-foreground text-sm truncate max-w-xs">
                    {tpl.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{tpl.properties?.length ?? 0}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/templates/${tpl.id}`}>
                          <Settings2 size={14} />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Delete this template?')) {
                            deleteMutation.mutate(tpl.id);
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
