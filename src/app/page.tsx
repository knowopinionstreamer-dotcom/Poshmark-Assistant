import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Package, TrendingUp, History } from 'lucide-react';
import { getRecentItems } from '@/app/inventory-actions';

export default async function DashboardPage() {
  const recentItems = await getRecentItems();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Reseller Dashboard</h1>
            <p className="text-muted-foreground">Welcome back to your command center.</p>
        </div>
        <Link href="/new-listing">
            <Button size="lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Listing
            </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inventory</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentItems.length}</div>
            <p className="text-xs text-muted-foreground">Items tracked in system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                ${recentItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Potential revenue</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold tracking-tight">Recent Activity</h2>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentItems.slice(0, 6).map((item) => (
                <Card key={item.id} className="overflow-hidden">
                    <div className="aspect-video relative bg-muted">
                        {item.images && item.images.length > 0 ? (
                            <img src={item.images[0]} alt={item.title || 'Item'} className="object-cover w-full h-full" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground text-xs">No Image</div>
                        )}
                    </div>
                    <CardHeader className="p-4">
                        <CardTitle className="truncate text-base">{item.title || 'Untitled Draft'}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-primary">${item.price || '0.00'}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary-foreground">{item.status}</span>
                        </div>
                    </CardContent>
                </Card>
            ))}
             {recentItems.length === 0 && (
                <p className="text-muted-foreground text-sm italic">No items found yet. Start by creating a listing!</p>
            )}
        </div>
      </div>
    </div>
  );
}
