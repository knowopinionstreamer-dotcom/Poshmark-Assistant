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
            {pathname === '/new-listing' && (
              <div className="ml-4 mt-1 space-y-1 border-l pl-4">
                <Link href="/new-listing?tab=upload">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                    1. Upload Photos
                  </Button>
                </Link>
                <Link href="/new-listing?tab=details">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                    2. Item Details
                  </Button>
                </Link>
                <Link href="/new-listing?tab=pricing">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                    3. Pricing Intel
                  </Button>
                </Link>
                <Link href="/new-listing?tab=draft">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-xs h-8">
                    4. Final Listing
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-muted-foreground">
            Reseller Tools
          </h2>
          <div className="space-y-1">
             <a href="https://tools.joinflyp.com/my-items" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" className="w-full justify-start">
                    <Package className="mr-2 h-4 w-4" />
                    Flyp Dashboard
                    <ExternalLink className="ml-auto h-3 w-3 opacity-50" />
                </Button>
            </a>
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
