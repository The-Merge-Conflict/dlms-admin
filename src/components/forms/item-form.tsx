'use client';
// src/components/forms/item-form.tsx
// Dynamic item form: choose a template, then render one value input per template
// property. Each value supports literal / URI / resource typing.
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useResourceTemplates, useResourceTemplate } from '@/lib/hooks/use-resource-templates';
import { useCreateItem, useUpdateItem } from '@/lib/hooks/use-items';
import { ItemDto } from '@/types/items';
import { ValueInput, ValueType } from '@/types/values';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm';

type ValueRow = {
  propertyId: number;
  propertyLabel: string;
  isRequired: boolean;
  type: ValueType;
  valueText: string;
  valueUri: string;
  valueResourceId: string;
  language: string;
};

function parseTypeString(t: string): ValueType {
  switch ((t || '').toLowerCase()) {
    case 'uri':
      return ValueType.Uri;
    case 'resource':
      return ValueType.Resource;
    default:
      return ValueType.Literal;
  }
}

interface Props {
  existing?: ItemDto;
}

export function ItemForm({ existing }: Props) {
  const router = useRouter();
  // Templates list is paginated; pull a large page to populate the dropdown.
  const { data: templatesPage } = useResourceTemplates(1, 200);
  const templates = templatesPage?.items ?? [];
  const createItem = useCreateItem();
  const updateItem = useUpdateItem(existing?.id ?? 0);

  const [templateId, setTemplateId] = useState<number>(existing?.templateId ?? 0);
  const { data: template } = useResourceTemplate(templateId);
  const [rows, setRows] = useState<ValueRow[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Map existing item values by propertyId for prefilling.
  const existingByProperty = useMemo(() => {
    const map = new Map<number, ItemDto['values'][number]>();
    existing?.values?.forEach((v) => map.set(v.propertyId, v));
    return map;
  }, [existing]);

  // Build the value rows whenever the selected template's properties load.
  useEffect(() => {
    if (!template) {
      setRows([]);
      return;
    }
    const sorted = [...template.properties].sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
    setRows(
      sorted.map((p) => {
        const ev = existingByProperty.get(p.propertyId);
        return {
          propertyId: p.propertyId,
          propertyLabel: p.alternateLabel || p.propertyLabel,
          isRequired: p.isRequired,
          type: ev ? parseTypeString(ev.type) : ValueType.Literal,
          valueText: ev?.valueText ?? '',
          valueUri: ev?.valueUri ?? '',
          valueResourceId: ev?.valueResourceId != null ? String(ev.valueResourceId) : '',
          language: ev?.language ?? 'en',
        };
      }),
    );
  }, [template, existingByProperty]);

  function updateRow(propertyId: number, patch: Partial<ValueRow>) {
    setRows((prev) =>
      prev.map((r) => (r.propertyId === propertyId ? { ...r, ...patch } : r)),
    );
  }

  async function handleSubmit() {
    setSubmitError(null);

    // Validate required fields.
    for (const r of rows) {
      if (r.isRequired) {
        const hasValue =
          (r.type === ValueType.Literal && r.valueText.trim()) ||
          (r.type === ValueType.Uri && r.valueUri.trim()) ||
          (r.type === ValueType.Resource && r.valueResourceId.trim());
        if (!hasValue) {
          setSubmitError(`"${r.propertyLabel}" is required.`);
          return;
        }
      }
    }

    // Only send rows that actually carry a value.
    const values: ValueInput[] = rows
      .filter((r) => {
        if (r.type === ValueType.Literal) return r.valueText.trim() !== '';
        if (r.type === ValueType.Uri) return r.valueUri.trim() !== '';
        return r.valueResourceId.trim() !== '';
      })
      .map((r) => ({
        propertyId: r.propertyId,
        valueText: r.type === ValueType.Literal ? r.valueText : null,
        valueUri: r.type === ValueType.Uri ? r.valueUri : null,
        valueResourceId:
          r.type === ValueType.Resource && r.valueResourceId
            ? Number(r.valueResourceId)
            : null,
        type: r.type,
        language: { code: r.language || 'en' },
      }));

    try {
      if (existing) {
        await updateItem.mutateAsync({
          templateId: templateId || null,
          values,
        });
        router.push(`/dashboard/items/${existing.id}`);
      } else {
        const { id } = await createItem.mutateAsync({
          templateId: templateId || null,
          values,
        });
        router.push(`/dashboard/items/${id}`);
      }
    } catch {
      setSubmitError('Failed to save the item. Please try again.');
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{existing ? `Edit Item #${existing.id}` : 'New Item'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="template">Template</Label>
          <select
            id="template"
            className={selectClass}
            value={templateId}
            onChange={(e) => setTemplateId(Number(e.target.value))}
          >
            <option value={0}>No template (free-form)</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {templateId === 0 && (
          <p className="text-sm text-muted-foreground">
            Select a template to fill in its properties. Items without a template are
            created empty and values can be added later.
          </p>
        )}

        {rows.map((row) => (
          <div key={row.propertyId} className="rounded-md border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                {row.propertyLabel}
                {row.isRequired && <span className="text-destructive"> *</span>}
              </Label>
              <select
                className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                value={row.type}
                onChange={(e) =>
                  updateRow(row.propertyId, { type: Number(e.target.value) as ValueType })
                }
              >
                <option value={ValueType.Literal}>Literal</option>
                <option value={ValueType.Uri}>URI</option>
                <option value={ValueType.Resource}>Resource</option>
              </select>
            </div>

            {row.type === ValueType.Literal && (
              <div className="flex gap-2">
                <Input
                  placeholder="Value"
                  value={row.valueText}
                  onChange={(e) => updateRow(row.propertyId, { valueText: e.target.value })}
                />
                <Input
                  className="w-20"
                  placeholder="lang"
                  value={row.language}
                  onChange={(e) => updateRow(row.propertyId, { language: e.target.value })}
                />
              </div>
            )}
            {row.type === ValueType.Uri && (
              <Input
                placeholder="https://example.org/resource"
                value={row.valueUri}
                onChange={(e) => updateRow(row.propertyId, { valueUri: e.target.value })}
              />
            )}
            {row.type === ValueType.Resource && (
              <Input
                type="number"
                placeholder="Linked item ID"
                value={row.valueResourceId}
                onChange={(e) =>
                  updateRow(row.propertyId, { valueResourceId: e.target.value })
                }
              />
            )}
          </div>
        ))}

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={createItem.isPending || updateItem.isPending}
          >
            {createItem.isPending || updateItem.isPending
              ? 'Saving…'
              : existing
                ? 'Update Item'
                : 'Create Item'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/items')}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
