'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { pricingResearchAction, visualSearchAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Search, ImageIcon, Loader2 } from 'lucide-react';
import type { ListingFormValues } from '@/app/schema';

export default function PricingResearch() {
  const { control, getValues } = useFormContext<ListingFormValues>();
  const { toast } = useToast();

  const [isTextSearching, setIsTextSearching] = useState(false);
  const [isVisualSearching, setIsVisualSearching] = useState(false);
  const [textSearchResults, setTextSearchResults] = useState<string[]>([]);
  const [visualSearchResults, setVisualSearchResults] = useState<string[]>([]);

  const handleTextSearch = async () => {
    const { brand, model } = getValues();
    if (!brand || !model) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide both Brand and Model for text search.',
      });
      return;
    }
    setIsTextSearching(true);
    setTextSearchResults([]);
    try {
      const result = await pricingResearchAction({ brand, model });
      setTextSearchResults(result.searchQueries);
      toast({ title: 'Text Search Complete' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Text Search Failed', description: (error as Error).message });
    } finally {
      setIsTextSearching(false);
    }
  };
  
  const handleVisualSearch = async () => {
    const { images, condition } = getValues();
    if (!images || images.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Image',
        description: 'Please upload at least one image for visual search.',
      });
      return;
    }
    setIsVisualSearching(true);
    setVisualSearchResults([]);
    try {
      const result = await visualSearchAction({ photoDataUris: images, condition: condition || 'Used' });
      setVisualSearchResults(result.searchResults);
      toast({ title: 'Visual Search Complete' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Visual Search Failed', description: (error as Error).message });
    } finally {
      setIsVisualSearching(false);
    }
  };

  const renderSearchResults = (title: string, results: string[], isSearch: boolean) => (
    (results.length > 0) && (
      <div className="space-y-2">
        <h4 className="font-semibold">{title}</h4>
        <ul className="space-y-1 list-disc list-inside">
          {results.map((result, index) => (
            <li key={index}>
              <a
                href={isSearch ? `https://www.google.com/search?q=${encodeURIComponent(result)}` : result}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center"
              >
                {result} <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing Research</CardTitle>
        <CardDescription>Research pricing on popular marketplaces and set your target price.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={handleTextSearch} disabled={isTextSearching}>
            {isTextSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2" />}
            Text Search
          </Button>
          <Button onClick={handleVisualSearch} disabled={isVisualSearching}>
            {isVisualSearching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2" />}
            Visual Search
          </Button>
        </div>
        
        <div className="space-y-4">
            {renderSearchResults("Text Search Queries", textSearchResults, true)}
            {renderSearchResults("Visual Search Results", visualSearchResults, false)}
        </div>

        <FormField
          control={control}
          name="targetPrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Price ($)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g. 49.99" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
