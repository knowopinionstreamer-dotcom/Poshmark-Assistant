'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { listingFormSchema, type ListingFormValues } from '@/app/schema';
import ImageUploader from '@/components/image-uploader';
import ItemDetailsFields from '@/components/item-details-fields';
import PricingResearch from '@/components/pricing-research';
import ListingDraft from '@/components/listing-draft';
import { useToast } from '@/hooks/use-toast';
import { analyzeImagesAction } from '@/app/actions';
import { Separator } from '@/components/ui/separator';

export default function PoshmarkProListerPage() {
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

  const images = form.watch('images');

  const handleImageUpload = (newImages: string[]) => {
    const currentImages = form.getValues('images');
    form.setValue('images', [...currentImages, ...newImages], { shouldValidate: true });
  };
  
  const handleClearImages = () => {
    form.reset({
      images: [],
      brand: '',
      model: '',
      style: '',
      color: '',
      gender: '',
      condition: 'Used',
      title: '',
      description: '',
      targetPrice: undefined
    });
  };

  const handleAnalyze = async () => {
    const images = form.getValues('images');
    if (images.length === 0) {
      toast({
        variant: 'destructive',
        title: 'No Images',
        description: 'Please upload images before analyzing.',
      });
      return;
    }
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
  };

  return (
     <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">Poshmark Pro Lister</h1>
        <p className="text-muted-foreground mt-2">Your AI-powered assistant for faster, smarter reselling.</p>
      </header>
      <FormProvider {...form}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 h-fit">
            <ImageUploader
              images={images}
              onImageUpload={handleImageUpload}
              onClear={handleClearImages}
              onAnalyze={handleAnalyze}
              isLoading={isAnalyzing}
            />
          </div>

          <div className="lg:col-span-3 space-y-8">
            <ItemDetailsFields isAnalyzing={isAnalyzing} />
            <Separator />
            <PricingResearch />
            <Separator />
            <ListingDraft />
          </div>
        </div>
      </FormProvider>
    </main>
  );
}
