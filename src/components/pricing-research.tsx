'use client';

import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, Loader2, Globe, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Textarea } from './ui/textarea';

type PricingResearchProps = {
    onTextSearch: () => void;
    isTextLoading: boolean;
    textQueries: string[] | null;
    suggestedPrice?: number;
    demand?: string;
    valueDrivers?: string[];
    matchCount?: number;
    priceExplanation?: string;
}

const getPlatformName = (url: string) => {
    try {
        const hostname = new URL(url).hostname;
        if (hostname.includes('poshmark')) return 'Poshmark';
        if (hostname.includes('ebay')) return 'eBay';
        if (hostname.includes('mercari')) return 'Mercari';
        if (hostname.includes('amazon')) return 'Amazon';
        if (hostname.includes('google')) return 'Google Shopping';
        return hostname;
    } catch (e) {
        return 'Search Result';
    }
};

export default function PricingResearch({ 
    onTextSearch, 
    isTextLoading, 
    textQueries, 
    suggestedPrice,
    demand,
    valueDrivers,
    matchCount,
    priceExplanation
}: PricingResearchProps) {
  const { control, getValues } = useFormContext();
  const { toast } = useToast();

  const handleCopyReport = () => {
    if (!priceExplanation) return;
    navigator.clipboard.writeText(priceExplanation);
    toast({ title: "Copied!", description: "Pricing report copied to clipboard." });
  };

  const handleGoogleSearch = () => {
    const { brand, model, visualSearchQuery, styleNumber, size } = getValues();
    if (!brand && !model && !visualSearchQuery) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide enough info for Google search.',
      });
      return;
    }
    const searchQuery = visualSearchQuery || [brand, model, styleNumber, size].filter(Boolean).join(' ');
    const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    window.open(url, '_blank');
  };

  const renderSearchResults = (title: string, results: string[] | null, isSearch: boolean) => (
    (results && results.length > 0) && (
      <div className="space-y-2">
        <h4 className="font-semibold">{title}</h4>
        <ul className="space-y-1 list-none p-0 flex flex-wrap gap-2">
          {results.map((result, index) => (
            <li key={index}>
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary/50 hover:bg-secondary text-secondary-foreground px-3 py-1.5 rounded-md text-sm inline-flex items-center transition-colors"
              >
                <Search className="mr-2 h-3 w-3" />
                {isSearch ? getPlatformName(result) : result}
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
        <CardTitle>Pricing Intel Center</CardTitle>
        <CardDescription>Advanced market analysis and research links.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {isTextLoading && (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                <p className="text-lg">AI is researching the market for you...</p>
            </div>
        )}

        {!isTextLoading && (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button onClick={onTextSearch} disabled={isTextLoading} variant="secondary">
                    {isTextLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2" />}
                    Run AI Pricing Research
                </Button>
                <Button onClick={handleGoogleSearch} variant="secondary">
                    <Globe className="mr-2" />
                    Google Visual Search
                </Button>
                </div>
                
                {suggestedPrice && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Alert className="md:col-span-1 border-primary/50 bg-primary/5">
                            <AlertTitle className="text-muted-foreground text-xs uppercase tracking-wider">Suggested Price</AlertTitle>
                            <AlertDescription className="text-3xl font-bold text-primary">
                                ${suggestedPrice.toFixed(2)}
                            </AlertDescription>
                        </Alert>

                        <div className="md:col-span-2 grid grid-cols-2 gap-4">
                            {demand && (
                                <div className="p-3 rounded-lg border bg-card">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Market Demand</p>
                                    <p className="text-lg font-semibold mt-1">{demand}</p>
                                </div>
                            )}
                            {matchCount !== undefined && (
                                <div className="p-3 rounded-lg border bg-card">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Exact Matches Found</p>
                                    <p className="text-lg font-semibold mt-1">{matchCount}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {priceExplanation && (
                    <div className="space-y-2 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">AI Pricing Report</p>
                            <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleCopyReport}
                                className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
                            >
                                <Copy className="mr-1 h-3 w-3" /> Copy Report
                            </Button>
                        </div>
                        <Textarea 
                            readOnly 
                            value={priceExplanation} 
                            className="bg-muted font-mono text-sm leading-relaxed" 
                            rows={6}
                        />
                    </div>
                )}

                {valueDrivers && valueDrivers.length > 0 && (
                    <div className="space-y-2">
                         <p className="text-xs text-muted-foreground uppercase tracking-wider">Why this Price?</p>
                         <div className="flex flex-wrap gap-2">
                            {valueDrivers.map((driver, i) => (
                                <span key={i} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full border border-primary/20">
                                    ✨ {driver}
                                </span>
                            ))}
                         </div>
                    </div>
                )}

                <div className="pt-4 border-t">
                    {renderSearchResults("Direct Market Links (Sold Only)", textQueries, true)}
                </div>

                <FormField
                control={control}
                name="targetPrice"
                render={({ field }) => (
                    <FormItem className="pt-4 border-t">
                    <FormLabel className="font-bold text-lg">Set Your Final Listing Price ($)</FormLabel>
                    <FormControl>
                        <Input type="number" step="0.01" className="text-xl h-12" placeholder="e.g. 49.99" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </>
        )}
      </CardContent>
    </Card>
  );
}
