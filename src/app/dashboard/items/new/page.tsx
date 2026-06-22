// src/app/dashboard/items/new/page.tsx
import { ItemForm } from '@/components/forms/item-form';

export default function NewItemPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Item</h1>
      <ItemForm />
    </div>
  );
}
