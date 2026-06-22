'use client';
// src/app/dashboard/templates/[id]/page.tsx
// Edit a template's label/description AND manage its attached properties.
import { use, useState } from 'react';
import {
  useResourceTemplate,
  useAddTemplateProperty,
  useRemoveTemplateProperty,
} from '@/lib/hooks/use-resource-templates';
import { useProperties } from '@/lib/hooks/use-properties';
import { ResourceTemplateForm } from '@/components/forms/resource-template-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

export default function TemplateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const templateId = Number(id);
  const { data: template, isLoading, error } = useResourceTemplate(templateId);
  // Properties list is paginated; pull a large page to populate the picker.
  const { data: allPropertiesPage } = useProperties(1, 200);
  const addProperty = useAddTemplateProperty(templateId);
  const removeProperty = useRemoveTemplateProperty(templateId);

  const [propertyId, setPropertyId] = useState(0);
  const [isRequired, setIsRequired] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(0);
  const [alternateLabel, setAlternateLabel] = useState('');

  if (isLoading) return <Skeleton className="h-96 w-full max-w-2xl" />;
  if (error || !template)
    return <p className="text-destructive">Template not found.</p>;

  const attachedIds = new Set(template.properties.map((p) => p.propertyId));
  const available = (allPropertiesPage?.items ?? []).filter(
    (p) => !attachedIds.has(p.id),
  );
  const sortedProps = [...template.properties].sort(
    (a, b) => a.displayOrder - b.displayOrder,
  );

  async function handleAdd() {
    if (!propertyId) return;
    await addProperty.mutateAsync({
      propertyId,
      isRequired,
      displayOrder,
      alternateLabel: alternateLabel || null,
    });
    setPropertyId(0);
    setIsRequired(false);
    setDisplayOrder(0);
    setAlternateLabel('');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Template</h1>
      <ResourceTemplateForm existing={template} />

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Attached Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedProps.length === 0 ? (
            <p className="text-muted-foreground">No properties attached yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Alternate Label</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedProps.map((p) => (
                  <TableRow key={p.propertyId}>
                    <TableCell>{p.displayOrder}</TableCell>
                    <TableCell className="font-medium">{p.propertyLabel}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.alternateLabel || '—'}
                    </TableCell>
                    <TableCell>
                      {p.isRequired ? (
                        <Badge>Required</Badge>
                      ) : (
                        <Badge variant="secondary">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (confirm('Remove this property from the template?')) {
                            removeProperty.mutate(p.propertyId);
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
            <h3 className="font-semibold">Attach a property</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="add-property">Property</Label>
                <select
                  id="add-property"
                  className={selectClass}
                  value={propertyId}
                  onChange={(e) => setPropertyId(Number(e.target.value))}
                >
                  <option value={0}>Select a property…</option>
                  {available.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} ({p.vocabularyLabel})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="display-order">Display Order</Label>
                <Input
                  id="display-order"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(Number(e.target.value))}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="alt-label">Alternate Label (optional)</Label>
                <Input
                  id="alt-label"
                  value={alternateLabel}
                  onChange={(e) => setAlternateLabel(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <input
                  id="required"
                  type="checkbox"
                  className="h-4 w-4"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                />
                <Label htmlFor="required">Required</Label>
              </div>
            </div>
            <Button onClick={handleAdd} disabled={!propertyId || addProperty.isPending}>
              <Plus size={16} className="mr-2" /> Attach Property
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
