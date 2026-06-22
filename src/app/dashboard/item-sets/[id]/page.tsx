'use client';
// src/app/dashboard/item-sets/[id]/page.tsx
// Edit an item set + manage its membership (add/remove items).
import { use, useState } from 'react';
import {
  useItemSet,
  useAddItemToSet,
  useRemoveItemFromSet,
} from '@/lib/hooks/use-item-sets';
import { useItems } from '@/lib/hooks/use-items';
import { ItemSetForm } from '@/components/forms/item-set-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Plus } from 'lucide-react';

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm';

export default function ItemSetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const setId = Number(id);
  const { data: itemSet, isLoading, error } = useItemSet(setId);
  // Load items so an admin can pick one to add to this set.
  const { data: itemsPage } = useItems(1, 100);
  const addItem = useAddItemToSet(setId);
  const removeItem = useRemoveItemFromSet(setId);
  const [selectedItemId, setSelectedItemId] = useState(0);

  if (isLoading) return <Skeleton className="h-96 w-full max-w-2xl" />;
  if (error || !itemSet)
    return <p className="text-destructive">Item set not found.</p>;

  // The backend may or may not return the set's members; handle both.
  const members = itemSet.items ?? [];
  const memberIds = new Set(members.map((m) => m.id));
  const availableItems = (itemsPage?.items ?? []).filter((i) => !memberIds.has(i.id));

  async function handleAdd() {
    if (!selectedItemId) return;
    await addItem.mutateAsync(selectedItemId);
    setSelectedItemId(0);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Item Set</h1>
      <ItemSetForm existing={itemSet} />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {itemSet.items === undefined && (
            <p className="text-xs text-muted-foreground">
              Note: the backend item-set response does not currently include its
              members, so the list below may be empty even after adding items.
              Add/remove actions are still sent to the server.
            </p>
          )}

          {members.length === 0 ? (
            <p className="text-muted-foreground">No items in this set yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">#{m.id}</TableCell>
                    <TableCell>{m.templateLabel || 'No template'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Remove this item from the set?')) {
                            removeItem.mutate(m.id);
                          }
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="border-t pt-4 space-y-3">
            <h3 className="font-semibold">Add an item</h3>
            <div className="space-y-1">
              <Label htmlFor="add-item">Item</Label>
              <select
                id="add-item"
                className={selectClass}
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(Number(e.target.value))}
              >
                <option value={0}>Select an item…</option>
                {availableItems.map((i) => (
                  <option key={i.id} value={i.id}>
                    #{i.id} — {i.templateLabel || 'No template'}
                  </option>
                ))}
              </select>
            </div>
            <Button onClick={handleAdd} disabled={!selectedItemId || addItem.isPending}>
              <Plus size={16} className="mr-2" /> Add to Set
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
