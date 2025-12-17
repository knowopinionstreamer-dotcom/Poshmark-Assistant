'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, ImageIcon, Loader2 } from 'lucide-react';

type PricingResearchProps = {
    onTextSearch: () => void;
    onVisualSearch: () => void;
    isTextLoading: boolean;
    isVisualLoading: boolean;
    textQueries: string[] | null;
    visualQueries: string[] | null;
}

export default function PricingResearch({ 
    onTextSearch, 
    onVisualSearch, 
    isTextLoading, 
    isVisualLoading, 
    textQueries, 
    visualQueries 
}: PricingResearchProps) {
  const { control } = useFormContext();

  const renderSearchResults = (title: string, results: string[] | null, isSearch: boolean) => (
    (results && results.length > 0) && (
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
          <Button onClick={onTextSearch} disabled={isTextLoading}>
            {isTextLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2" />}
            Text Search
          </Button>
          <Button onClick={onVisualSearch} disabled={isVisualLoading}>
            {isVisualLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2" />}
            Visual Search
          </Button>
        </div>
        
        <div className="space-y-4">
            {renderSearchResults("Text Search Queries", textQueries, true)}
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
