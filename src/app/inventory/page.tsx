import { getRecentItems } from '@/app/inventory-actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default async function InventoryPage() {
  const items = await getRecentItems();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline text-primary">Full Inventory</h1>
         <Link href="/new-listing">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Item
            </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-card">
                <div className="aspect-square relative bg-muted">
                    {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.title || 'Item'} className="object-cover w-full h-full" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-xs">No Image</div>
                    )}
                    <div className="absolute top-2 right-2">
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/60 text-white backdrop-blur-md">
                            {item.status}
                        </span>
                    </div>
                </div>
                <CardHeader className="p-4">
                    <CardTitle className="truncate text-base" title={item.title || 'Untitled'}>
                        {item.title || 'Untitled Draft'}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-end">
                         <div>
                            <p className="text-xs text-muted-foreground">{item.brand}</p>
                            <p className="text-[10px] text-muted-foreground">{item.size ? `Size: ${item.size}` : ''}</p>
                         </div>
                        <span className="font-bold text-lg text-primary">${item.price || '0.00'}</span>
                    </div>
                </CardContent>
            </Card>
        ))}
         {items.length === 0 && (
            <div className="col-span-full text-center py-20 bg-muted/10 rounded-lg border-2 border-dashed">
                <h3 className="text-xl font-semibold mb-2">Your inventory is empty</h3>
                <p className="text-muted-foreground mb-6">Start by adding your first listing.</p>
                <Link href="/new-listing">
                    <Button size="lg" variant="secondary">Create Listing</Button>
                </Link>
            </div>
        )}
      </div>
    </div>
  );
}
