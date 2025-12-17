'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, ImageIcon, Loader2, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PricingResearchProps = {
    onTextSearch: () => void;
    onVisualSearch: () => void;
    isTextLoading: boolean;
    isVisualLoading: boolean;
    textQueries: string[] | null;
    visualQueries: string[] | null;
}

const getPlatformName = (url: string) => {
    try {
        const hostname = new URL(url).hostname;
        if (hostname.includes('poshmark')) return 'Poshmark';
        if (hostname.includes('ebay')) return 'eBay';
        if (hostname.includes('mercari')) return 'Mercari';
        if (hostname.includes('amazon')) return 'Amazon';
        return hostname;
    } catch (e) {
        return 'Search Result';
    }
};

export default function PricingResearch({ 
    onTextSearch, 
    onVisualSearch, 
    isTextLoading, 
    isVisualLoading, 
    textQueries, 
    visualQueries 
}: PricingResearchProps) {
  const { control, getValues } = useFormContext();
  const { toast } = useToast();

  const handleGoogleSearch = () => {
    const { brand, model, size } = getValues();
    if (!brand && !model) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a Brand and/or Model for Google search.',
      });
      return;
    }
    const searchQuery = [brand, model, size].filter(Boolean).join(' ');
    const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(url, '_blank');
  };

  const renderSearchResults = (title: string, results: string[] | null, isSearch: boolean) => (
    (results && results.length > 0) && (
      <div className="space-y-2">
        <h4 className="font-semibold">{title}</h4>
        <ul className="space-y-1 list-none p-0">
          {results.map((result, index) => (
            <li key={index}>
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline inline-flex items-center"
              >
                {isSearch ? `Search on ${getPlatformName(result)}` : result} <ExternalLink className="ml-1 h-3 w-3" />
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button onClick={onTextSearch} disabled={isTextLoading} variant="secondary">
            {isTextLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2" />}
            Text Search
          </Button>
          <Button onClick={onVisualSearch} disabled={isVisualLoading} variant="secondary">
            {isVisualLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2" />}
            Visual Search
          </Button>
           <Button onClick={handleGoogleSearch} variant="secondary">
            <Globe className="mr-2" />
            Google Search
          </Button>
        </div>
        
        <div className="space-y-4">
            {renderSearchResults("Text Search Results", textQueries, true)}
            {renderSearchResults("Visual Search Results", visualQueries, false)}
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
