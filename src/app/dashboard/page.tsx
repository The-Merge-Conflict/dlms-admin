// src/app/dashboard/page.tsx
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Package, Layers, Image as ImageIcon } from 'lucide-react';

export default function DashboardHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the Digital Library Management System.
        </p>
      </div>

      {/* Quick Stats / Navigation Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Vocabularies Card (The one you just built!) */}
        <Link href="/dashboard/vocabularies" className="transition-transform hover:scale-105">
          <Card className="hover:border-primary cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vocabularies</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Manage</div>
              <p className="text-xs text-muted-foreground mt-1">
                Define metadata schemas
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Items Card (Placeholder for future) */}
        <Link href="/dashboard/items" className="transition-transform hover:scale-105">
          <Card className="hover:border-primary cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Library Items</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Browse</div>
              <p className="text-xs text-muted-foreground mt-1">
                View all digital assets
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Item Sets Card (Placeholder) */}
        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Item Sets</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Collections</div>
            <p className="text-xs text-muted-foreground mt-1">Coming soon...</p>
          </CardContent>
        </Card>

        {/* Media Card (Placeholder) */}
        <Card className="opacity-60">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Media Gallery</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Files</div>
            <p className="text-xs text-muted-foreground mt-1">Coming soon...</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}