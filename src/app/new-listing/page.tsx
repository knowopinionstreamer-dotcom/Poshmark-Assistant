'use client';

import { useState, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import {
  analyzeImagesAction,
  draftGenerationAction,
  pricingResearchAction,
} from '@/app/actions';
import { saveItemDraft, getRecentItems } from '@/app/inventory-actions';
import { ArrowRight, CheckCircle2, FileText, Sparkles, Save, History } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageUploader from '@/components/image-uploader';
import ItemDetailsFields from '@/components/item-details-fields';
import PricingResearch from '@/components/pricing-research';
import ListingDraft from '@/components/listing-draft';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { listingFormSchema, type ListingFormValues } from '@/app/schema';
import type { DraftGenerationOutput } from '@/ai/flows/draft-generation';
import type { PricingResearchOutput } from '@/ai/flows/pricing-research';
import ImagePreview from '@/components/image-preview';

const defaultDisclaimer = `\n\n**BUYER INFORMATION (Please Read):**\n- Photos are of actual sale item and accurately represent its condition. Any marks or imperfections should be in the photos.\n- If you have any questions or concerns or want more photos, please ask BEFORE purchase.\n- The items color may be slightly different due to your screen settings and lighting.\n- Everything comes from a smoke-free, pet-free environment.\n- All reasonable offers considered. Bundle 2 or more items for discounted Price and Shipping.\n- Item is Cross-listed\n- Thanks for looking! Check out my other listings for more great items and prices!!!`;

export default function PoshmarkProListerPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();

  const [loadingStates, setLoadingStates] = useState({
    analysis: false,
    textSearch: false,
    draft: false,
  });

  const [textSearchResults, setTextSearchResults] = useState<PricingResearchOutput | null>(null);
  const [listingDraft, setListingDraft] = useState<DraftGenerationOutput | null>(null);

  const handleSaveDraft = async () => {
    const values = form.getValues();
    try {
        await saveItemDraft({
            ...values,
            price: values.targetPrice,
            status: 'DRAFT'
        });
        toast({ title: 'Draft Saved', description: 'Your item has been saved to the database.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Save Failed', description: 'Could not save to database.' });
    }
  };

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingFormSchema),
    defaultValues: {
      images: [],
      brand: '',
      model: '',
      size: '',
      style: '',
      color: '',
      gender: '',
      condition: 'Used',
      title: '',
      description: '',
      disclaimer: defaultDisclaimer,
    },
  });

  const images = form.watch('images');

  const handleImageUpload = (newImages: string[]) => {
    const currentImages = form.getValues('images');
    form.setValue('images', [...currentImages, ...newImages], { shouldValidate: true });
    setListingDraft(null);
    setTextSearchResults(null);
  };

  const handleImageRemove = (index: number) => {
    const currentImages = form.getValues('images');
    const updatedImages = currentImages.filter((_, i) => i !== index);
    form.setValue('images', updatedImages, { shouldValidate: true });
    toast({
      title: 'Image Removed',
      description: `Image ${index + 1} has been removed.`,
    });
  };

  const handleClearImages = () => {
    form.reset({
      images: [],
      brand: '',
      model: '',
      size: '',
      style: '',
      color: '',
      gender: '',
      condition: 'Used',
      title: '',
      description: '',
      targetPrice: undefined,
      disclaimer: defaultDisclaimer,
    });
    setListingDraft(null);
    setTextSearchResults(null);
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
    setLoadingStates(prev => ({ ...prev, analysis: true }));
    setActiveTab('details');
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
      setLoadingStates(prev => ({ ...prev, analysis: false }));
    }
  };
  
  const handleTextSearch = async () => {
    const { brand, model, size, condition } = form.getValues();
    if (!brand || !model) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide both Brand and Model for text search.',
      });
      return;
    }
    setLoadingStates(prev => ({ ...prev, textSearch: true }));
    setTextSearchResults(null);
    try {
      const result = await pricingResearchAction({ brand, model, size, condition: condition || 'Used' });
      setTextSearchResults(result);
      if (result.suggestedPrice) {
        form.setValue('targetPrice', result.suggestedPrice);
      }
      toast({ title: 'Text Search Complete' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Text Search Failed', description: (error as Error).message });
    } finally {
      setLoadingStates(prev => ({ ...prev, textSearch: false }));
    }
  };
  
  const handleDraftGeneration = async () => {
    const values = form.getValues();
    const { brand, model, style, color, gender, condition, disclaimer } = values;

    const requiredFields = { brand, model, style, color, gender, condition };

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
    
    setLoadingStates(prev => ({ ...prev, draft: true }));
    try {
      const result = await draftGenerationAction({
        brand: brand!,
        model: model!,
        style: style!,
        color: color!,
        gender: gender!,
        condition: condition!,
      });
      form.setValue('title', result.title);
      form.setValue('description', result.description + (disclaimer || ''));
      setListingDraft(result);
      toast({ title: 'Draft Generated', description: 'Your listing title and description are ready.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Draft Generation Failed', description: (error as Error).message });
    } finally {
      setLoadingStates(prev => ({ ...prev, draft: false }));
    }
  };

  const handleContinueToPricing = () => {
    setActiveTab('pricing');
    handleTextSearch();
  }

  const itemDetailsFooter = (
     <>
        <Button 
            variant="outline" 
            onClick={() => setActiveTab('draft')}
            className="flex-1 sm:flex-none"
        >
            <FileText className="mr-2 h-4 w-4" />
            Skip Pricing & Generate Listing
        </Button>

        <Button 
            variant="secondary"
            onClick={handleContinueToPricing}
            className="flex-1 sm:flex-none"
        >
            Continue to AI Price Comparison
            <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
    </>
  );

  return (
     <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold font-headline text-primary">Poshmark Assistant ver1.0</h1>
        <p className="text-muted-foreground mt-2">Your AI-powered assistant for faster, smarter reselling.</p>
      </header>
      <FormProvider {...form}>
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
            <TabsList className="grid w-full grid-cols-4 h-auto p-1 bg-muted rounded-lg">
              <TabsTrigger value="upload" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">1. Upload</TabsTrigger>
              <TabsTrigger value="details" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">2. Details</TabsTrigger>
              <TabsTrigger value="pricing" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">3. Pricing</TabsTrigger>
              <TabsTrigger value="draft" className="py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm">4. Listing</TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
                <ImageUploader
                    images={images}
                    onImageUpload={handleImageUpload}
                    onImageRemove={handleImageRemove}
                    onClear={handleClearImages}
                    onAnalyze={handleAnalyze}
                    isLoading={loadingStates.analysis}
                />
            </TabsContent>
            
            <TabsContent value="details">
                 <div className="space-y-8">
                    <ImagePreview images={images} showClearButton={false} />
                    <ItemDetailsFields isAnalyzing={loadingStates.analysis} footerActions={itemDetailsFooter} />
                </div>
            </TabsContent>

            <TabsContent value="pricing">
                <div className="space-y-8">
                    <ImagePreview images={images} showClearButton={false} />
                    <div className="space-y-4">
                        <PricingResearch 
                          onTextSearch={handleTextSearch}
                          isTextLoading={loadingStates.textSearch}
                          textQueries={textSearchResults?.searchQueries || []}
                          suggestedPrice={textSearchResults?.suggestedPrice}
                        />
                         <div className="flex justify-end">
                            <Button onClick={() => { setActiveTab("draft"); handleDraftGeneration(); }} size="lg" variant="secondary" className="w-full sm:w-auto">
                                I have my price, go to Final Step <CheckCircle2 className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="draft">
                <div className="space-y-8">
                    <ImagePreview images={images} showClearButton={false} />
                    <ListingDraft 
                      onGenerateDraft={handleDraftGeneration} 
                      isLoading={loadingStates.draft}
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleSaveDraft} size="lg" className="w-full sm:w-auto">
                            <Save className="mr-2 h-5 w-5" />
                            Save to Inventory
                        </Button>
                    </div>
                </div>
            </TabsContent>

         </Tabs>
      </FormProvider>
    </main>
  );
}
