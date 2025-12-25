'use client';

import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { deleteItem, updateItemStatus } from '@/app/inventory-actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreVertical, CheckCircle, Tag, ShoppingCart } from 'lucide-react';

interface InventoryItemCardProps {
    item: any;
}

export default function InventoryItemCard({ item }: InventoryItemCardProps) {
    const { toast } = useToast();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        
        setIsDeleting(true);
        try {
            await deleteItem(item.id);
            toast({ title: 'Item Deleted' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Delete Failed' });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        setIsUpdating(true);
        try {
            await updateItemStatus(item.id, newStatus);
            toast({ title: `Status Updated to ${newStatus}` });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Update Failed' });
        } finally {
            setIsUpdating(false);
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'LISTED': return 'bg-blue-500/80';
            case 'SOLD': return 'bg-green-500/80';
            default: return 'bg-black/60';
        }
    };

    return (
        <Card className="overflow-hidden hover:shadow-lg transition-all bg-card group relative">
            <div className="aspect-square relative bg-muted">
                {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title || 'Item'} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-xs font-medium uppercase tracking-wider">No Image</div>
                )}
                
                <div className="absolute top-2 left-2 flex gap-1">
                    <span className={cn("text-[10px] font-bold px-2 py-1 rounded text-white backdrop-blur-md", getStatusBadgeColor(item.status))}>
                        {item.status}
                    </span>
                </div>

                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-lg">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusUpdate('DRAFT')}>
                                <Tag className="mr-2 h-4 w-4" /> Mark as Draft
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate('LISTED')}>
                                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Listed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusUpdate('SOLD')}>
                                <ShoppingCart className="mr-2 h-4 w-4" /> Mark as Sold
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Link href={`/new-listing?id=${item.id}`}>
                        <Button size="sm" variant="secondary" className="font-semibold">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                        </Button>
                    </Link>
                    <Button size="sm" variant="destructive" onClick={handleDelete} disabled={isDeleting} className="font-semibold">
                        <Trash2 className="h-4 w-4 mr-2" />
                        {isDeleting ? '...' : 'Delete'}
                    </Button>
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
                    <span className="font-bold text-lg text-primary">${item.price?.toFixed(2) || '0.00'}</span>
                </div>
            </CardContent>
        </Card>
    );
}
