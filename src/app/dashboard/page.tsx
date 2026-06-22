// src/app/dashboard/page.tsx
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BookOpen,
  Tag,
  LayoutTemplate,
  Package,
  Layers,
  Image as ImageIcon,
  Users,
} from 'lucide-react';

// One entry per top-level entity. Add/remove here to control the grid.
const cards = [
  {
    href: '/dashboard/vocabularies',
    title: 'Vocabularies',
    heading: 'Manage',
    description: 'Define metadata schemas',
    Icon: BookOpen,
  },
  {
    href: '/dashboard/properties',
    title: 'Properties',
    heading: 'Define',
    description: 'Reusable metadata fields',
    Icon: Tag,
  },
  {
    href: '/dashboard/templates',
    title: 'Resource Templates',
    heading: 'Design',
    description: 'Property sets for items',
    Icon: LayoutTemplate,
  },
  {
    href: '/dashboard/items',
    title: 'Library Items',
    heading: 'Browse',
    description: 'View all digital assets',
    Icon: Package,
  },
  {
    href: '/dashboard/item-sets',
    title: 'Item Sets',
    heading: 'Collections',
    description: 'Group items into sets',
    Icon: Layers,
  },
  {
    href: '/dashboard/media',
    title: 'Media Gallery',
    heading: 'Files',
    description: 'Upload & manage media',
    Icon: ImageIcon,
  },
  {
    href: '/dashboard/users',
    title: 'Users',
    heading: 'Accounts',
    description: 'Manage user access',
    Icon: Users,
  },
];

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the Digital Library Management System.
        </p>
      </div>

      {/* Navigation cards — one per entity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ href, title, heading, description, Icon }) => (
          <Link
            key={href}
            href={href}
            className="transition-transform hover:scale-105"
          >
            <Card className="hover:border-primary cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{heading}</div>
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}