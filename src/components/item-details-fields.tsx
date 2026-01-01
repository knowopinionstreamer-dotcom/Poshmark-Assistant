'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ItemDetailsFieldsProps = {
  isAnalyzing: boolean;
  footerActions?: React.ReactNode;
};

const FieldSkeleton = () => <Skeleton className="h-10 w-full" />;

export default function ItemDetailsFields({ isAnalyzing, footerActions }: ItemDetailsFieldsProps) {
  const { control, getValues } = useFormContext();
  const { toast } = useToast();
  const genders = ['Womens', 'Mens', 'Unisex', 'Kids'];
  const conditions = ['New with tags', 'Excellent used condition', 'Good used condition', 'Fair condition', 'Used'];

  const copyToClipboard = (fieldName: string, label: string) => {
    const value = getValues(fieldName);
    if (!value) {
        toast({ variant: "destructive", title: "Nothing to copy", description: `The ${label} is currently empty.` });
        return;
    }
    navigator.clipboard.writeText(value);
    toast({ title: "Copied!", description: `${label} has been copied.` });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Item Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isAnalyzing ? (
            <>
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
            </>
            ) : (
            <>
                <FormField
                control={control}
                name="brand"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Nike" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="model"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Model / Name</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. Air Max 90" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="styleNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Style Number / SKU</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. AR4230-001" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="size"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Size</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. 10.5" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="style"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Style</FormLabel>
                    <FormControl>
                    <Input placeholder="e.g. Sneaker" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="color"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g. White / Red" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="gender"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {genders.map((gender) => (
                            <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={control}
                name="condition"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a condition" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {conditions.map((condition) => (
                            <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="sm:col-span-2">
                    <FormField
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>Extracted Details / Notes</FormLabel>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-xs text-muted-foreground hover:text-primary"
                                onClick={() => copyToClipboard('description', 'Description')}
                            >
                                <Copy className="mr-1 h-3 w-3" /> Copy
                            </Button>
                        </div>
                        <FormControl>
                            <textarea 
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Detailed description extracted from images..."
                                {...field} 
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
            </>
            )}
        </div>
      </CardContent>
       {footerActions && !isAnalyzing && (
        <CardFooter className="border-t p-4 flex flex-col sm:flex-row gap-3 justify-between">
           {footerActions}
        </CardFooter>
      )}
    </Card>
  );
}
