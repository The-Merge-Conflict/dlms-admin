'use client';
// src/app/dashboard/users/page.tsx
// The backend currently exposes only registration (POST /api/auth/register) and
// no "list users" endpoint, so this page focuses on creating user accounts.
import { RegisterForm } from '@/components/forms/register-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Users</h1>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>About user management</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>
            The DLMS API supports creating accounts via registration. A
            “list all users” endpoint is not available yet, so existing users
            cannot be displayed here.
          </p>
          <p>
            Once the backend adds a users listing endpoint, this page can be
            extended with a table and role-management actions.
          </p>
        </CardContent>
      </Card>

      <RegisterForm />
    </div>
  );
}
