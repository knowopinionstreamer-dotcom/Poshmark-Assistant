'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

type ItemDetailsFieldsProps = {
  isAnalyzing: boolean;
  footerActions?: React.ReactNode;
};

const FieldSkeleton = () => <Skeleton className="h-10 w-full" />;

export default function ItemDetailsFields({ isAnalyzing, footerActions }: ItemDetailsFieldsProps) {
  const { control } = useFormContext();
  const genders = ['Womens', 'Mens', 'Unisex', 'Kids'];
  const conditions = ['New with tags', 'Excellent used condition', 'Good used condition', 'Fair condition', 'Used'];

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
