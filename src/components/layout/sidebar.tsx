// src/components/layout/sidebar.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen, Tag, FileText, Package, Layers, Image, Users, LayoutDashboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard',            label: 'Overview',   icon: LayoutDashboard },
  { href: '/dashboard/vocabularies', label: 'Vocabularies', icon: BookOpen },
  { href: '/dashboard/properties',   label: 'Properties',  icon: Tag },
  { href: '/dashboard/templates',    label: 'Templates',   icon: FileText },
  { href: '/dashboard/items',        label: 'Items',       icon: Package },
  { href: '/dashboard/item-sets',    label: 'Item Sets',   icon: Layers },
  { href: '/dashboard/media',        label: 'Media',       icon: Image },
  { href: '/dashboard/users',        label: 'Users',       icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r bg-card h-screen flex flex-col">
      <div className="p-6 border-b">
        <h1 className="font-bold text-lg">DLMS Admin</h1>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
              pathname === href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}