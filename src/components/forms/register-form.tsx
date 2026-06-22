'use client';
// src/components/forms/register-form.tsx
// Admin-only form to create a new user account. Uses POST /api/auth/register.
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/lib/validations/auth.schema';
import { useRegister } from '@/lib/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function RegisterForm({ onCreated }: { onCreated?: () => void }) {
  const registerMutation = useRegister();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'Viewer',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    setSuccess(null);
    try {
      const result = await registerMutation.mutateAsync(values);
      if (!result.succeeded) {
        setServerError(result.errors?.join(', ') || 'Registration failed');
        return;
      }
      setSuccess(`User "${result.userName}" created successfully.`);
      reset();
      onCreated?.();
    } catch (e: unknown) {
      const err = e as { response?: { data?: unknown } };
      const data = err.response?.data;
      setServerError(
        Array.isArray(data) ? data.join(', ') : 'Registration failed. Please try again.',
      );
    }
  }

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Create User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="userName">Username</Label>
            <Input id="userName" {...register('userName')} placeholder="jane.doe" />
            {errors.userName && (
              <p className="text-sm text-destructive">{errors.userName.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} placeholder="jane@dlms.local" />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input id="confirmPassword" type="password" {...register('confirmPassword')} />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="role">Role</Label>
            <select id="role" className={selectClass} {...register('role')}>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>
          {serverError && <p className="text-sm text-destructive">{serverError}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
