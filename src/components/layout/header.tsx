// src/components/layout/header.tsx
'use client';
import { logout } from '@/lib/api/auth';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 border-b flex items-center justify-between px-6 bg-card">
      <div /> {/* left side — breadcrumbs could go here */}
      <Button variant="ghost" size="sm" onClick={logout}>
        <LogOut size={16} className="mr-2" />
        Logout
      </Button>
    </header>
  );
}