// src/app/dashboard/templates/new/page.tsx
import { ResourceTemplateForm } from '@/components/forms/resource-template-form';

export default function NewTemplatePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Resource Template</h1>
      <ResourceTemplateForm />
    </div>
  );
}
