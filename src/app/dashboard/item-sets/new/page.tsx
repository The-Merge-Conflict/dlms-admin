// src/app/dashboard/item-sets/new/page.tsx
import { ItemSetForm } from '@/components/forms/item-set-form';

export default function NewItemSetPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Item Set</h1>
      <ItemSetForm />
    </div>
  );
}
