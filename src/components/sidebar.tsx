'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, PlusCircle, Package, Settings, Image as ImageIcon, ExternalLink } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="pb-12 min-h-screen border-r bg-card w-64 hidden md:block fixed left-0 top-0">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-xl font-semibold tracking-tight text-primary font-headline">
            Poshmark Pro
          </h2>
          <div className="space-y-1">
            <Link href="/">
                <Button variant={pathname === '/' ? 'secondary' : 'ghost'} className="w-full justify-start">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                </Button>
            </Link>
            <Link href="/new-listing">
                <Button variant={pathname === '/new-listing' ? 'secondary' : 'ghost'} className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Listing
                </Button>
            </Link>
            <Link href="/inventory">
                <Button variant={pathname === '/inventory' ? 'secondary' : 'ghost'} className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Inventory
                </Button>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-muted-foreground">
            External
          </h2>
          <div className="space-y-1">
             <a href="https://photos.google.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="w-full justify-start">
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Google Photos
                    <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
