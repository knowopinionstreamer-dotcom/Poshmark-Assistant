'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Copy } from 'lucide-react';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';

type ListingDraftProps = {
    onGenerateDraft: () => void;
    isLoading: boolean;
};

export default function ListingDraft({ onGenerateDraft, isLoading }: ListingDraftProps) {
  const { control, getValues } = useFormContext();
  const { toast } = useToast();

  const copyToClipboard = (fieldName: string, label: string) => {
    const value = getValues(fieldName);
    if (!value) {
        toast({ variant: "destructive", title: "Nothing to copy", description: `The ${label} is currently empty.` });
        return;
    }
    navigator.clipboard.writeText(value);
    toast({ title: "Copied!", description: `${label} has been copied to your clipboard.` });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Draft</CardTitle>
        <CardDescription>Generate a compelling title and description for your listing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={onGenerateDraft} disabled={isLoading} className="w-full" variant="secondary">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2" />}
          🚀 Generate Pro Listing
        </Button>

        <div className="space-y-4">
          <FormField
            control={control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                    <FormLabel>Title</FormLabel>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
                        onClick={() => copyToClipboard('title', 'Title')}
                    >
                        <Copy className="mr-1 h-3 w-3" /> Copy Title
                    </Button>
                </div>
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
                <div className="flex items-center justify-between">
                    <FormLabel>Description</FormLabel>
                    <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
                        onClick={() => copyToClipboard('description', 'Description')}
                    >
                        <Copy className="mr-1 h-3 w-3" /> Copy Description
                    </Button>
                </div>
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
