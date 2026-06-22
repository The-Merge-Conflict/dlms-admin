// src/app/dashboard/properties/new/page.tsx
import { PropertyForm } from '@/components/forms/property-form';

export default function NewPropertyPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Property</h1>
      <PropertyForm />
    </div>
  );
}
