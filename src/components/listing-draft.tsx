'use client';

import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { draftGenerationAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2 } from 'lucide-react';
import type { ListingFormValues } from '@/app/schema';

const DISCLAIMER = `\n\n**Buyer Information:** Thank you for your interest! Please review all photos and the description carefully before purchasing. All sales are final. Feel free to ask any questions. Happy Poshing!`;

export default function ListingDraft() {
  const { control, getValues, setValue, watch } = useFormContext<ListingFormValues>();
  const { toast } = useToast();
  const [isDrafting, setIsDrafting] = useState(false);

  const targetPrice = watch('targetPrice');

  const handleDraftGeneration = async () => {
    const values = getValues();
    const { brand, model, style, color, gender, condition, targetPrice } = values;

    if (!targetPrice) {
      toast({
        variant: 'destructive',
        title: 'Price not set',
        description: 'Please set a target price before generating a draft.',
      });
      return;
    }

    const requiredFields = { brand, model, style, color, gender, condition, targetPrice };

    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: `Please provide the '${key}' before generating a draft.`,
            });
            return;
        }
    }
    
    setIsDrafting(true);
    try {
      const result = await draftGenerationAction({
        brand: brand!,
        model: model!,
        style: style!,
        color: color!,
        gender: gender!,
        condition: condition!,
        targetPrice: targetPrice!
      });
      setValue('title', result.title);
      // Append generated description with original description if it exists, plus disclaimer
      const originalDescription = getValues('description') || '';
      const newDescription = `${result.description}\n\n--- AI Generated Details ---\n${originalDescription}`;
      setValue('description', newDescription + DISCLAIMER);
      toast({ title: 'Draft Generated', description: 'Your listing title and description are ready.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Draft Generation Failed', description: (error as Error).message });
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listing Draft</CardTitle>
        <CardDescription>Generate a compelling title and description for your listing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleDraftGeneration} disabled={isDrafting || !targetPrice} className="w-full">
          {isDrafting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2" />}
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
        </div>
      </CardContent>
    </Card>
  );
}
