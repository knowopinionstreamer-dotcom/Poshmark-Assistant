'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { Separator } from './ui/separator';

type ListingDraftProps = {
    onGenerateDraft: () => void;
    isLoading: boolean;
};

export default function ListingDraft({ onGenerateDraft, isLoading }: ListingDraftProps) {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Draft</CardTitle>
        <CardDescription>Generate a compelling title and description for your listing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={onGenerateDraft} disabled={isLoading} className="w-full" variant="secondary">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2" />}
          Generate Listing Draft
        </Button>

        <div className="space-y-4">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="AI-generated title will appear here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="AI-generated description will appear here" {...field} rows={10} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
           <FormField
            control={control}
            name="disclaimer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Disclaimer</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your default disclaimer. Edit here to change it for this and future listings." {...field} rows={8} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
