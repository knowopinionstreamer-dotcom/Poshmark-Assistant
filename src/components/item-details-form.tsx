'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { listingFormSchema, type ListingFormValues } from '@/app/schema';
import ImageUploader from './image-uploader';
import ItemDetailsFields from './item-details-fields';
import PricingResearch from './pricing-research';
import ListingDraft from './listing-draft';
import { useToast } from '@/hooks/use-toast';
import { analyzeImagesAction } from '@/app/actions';
import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';

export default function ItemDetailsForm() {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      images: [],
      brand: '',
      model: '',
      style: '',
      color: '',
      gender: '',
      condition: 'Used',
    },
  });

  const handleImageUpload = async (images: string[]) => {
    form.setValue('images', images, { shouldValidate: true });
    if (images.length > 0) {
      setIsAnalyzing(true);
      try {
        const result = await analyzeImagesAction({ photoDataUris: images });
        if (result) {
          form.setValue('brand', result.brand || '');
          form.setValue('model', result.model || '');
          form.setValue('style', result.style || '');
          form.setValue('color', result.color || '');
          form.setValue('gender', result.gender || '');
          form.setValue('condition', result.condition || 'Used');
          form.setValue('description', result.description || '');
          toast({
            title: 'Analysis Complete',
            description: 'Item details have been pre-filled by AI.',
          });
        }
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: (error as Error).message,
        });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <FormProvider {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="lg:col-span-2 h-fit">
          <CardContent className="p-6">
            <ImageUploader onImagesChange={handleImageUpload} />
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-8">
          <ItemDetailsFields isAnalyzing={isAnalyzing} />
          <Separator />
          <PricingResearch />
          <Separator />
          <ListingDraft />
        </div>
      </div>
    </FormProvider>
  );
}
