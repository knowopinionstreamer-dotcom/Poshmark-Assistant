import { getRecentItems } from '@/app/inventory-actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import InventoryItemCard from '@/components/inventory-item-card';

export default async function InventoryPage() {
  const items = await getRecentItems(); // No limit passed, so it gets all (recent first)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Full Inventory</h1>
            <p className="text-muted-foreground">Manage and track all your drafted and listed items.</p>
        </div>
         <Link href="/new-listing">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Item
            </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
            <InventoryItemCard key={item.id} item={item} />
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
