
'use server';

import {
  analyzeImagesToGenerateItemDetails,
  ImageAnalysisForListingInput,
  ImageAnalysisForListingOutput,
} from '@/ai/flows/image-analysis-for-listing';
import {
  performPricingResearch,
  PricingResearchInput,
  PricingResearchOutput,
  performVisualSearch,
  VisualSearchForPricingOutput,
} from '@/ai/flows/pricing-research';
import {
  performDraftGeneration,
  DraftGenerationInput,
  DraftGenerationOutput,
} from '@/ai/flows/draft-generation';

export async function analyzeImagesAction(
  data: ImageAnalysisForListingInput
): Promise<ImageAnalysisForListingOutput> {
  try {
    const result = await analyzeImagesToGenerateItemDetails(data);
    return result;
  } catch (error) {
    console.error('Error in analyzeImagesAction:', error);
    throw new Error('Failed to analyze images.');
  }
}

export async function pricingResearchAction(
  data: PricingResearchInput
): Promise<PricingResearchOutput> {
  try {
    const result = await performPricingResearch(data);
    return result;
  } catch (error) {
    console.error('Error in pricingResearchAction:', error);
    throw new Error('Failed to perform pricing research.');
  }
}

export async function visualSearchAction(input: {
  photoDataUris: string[];
  condition: string;
}): Promise<VisualSearchForPricingOutput> {
  const mainImage =
    input.photoDataUris && input.photoDataUris.length > 0
      ? input.photoDataUris[0]
      : null;

  if (!mainImage) {
    throw new Error('No image available for visual search.');
  }

  try {
    const result = await performVisualSearch({
      photoDataUri: mainImage,
      condition: input.condition,
    });
    return result;
  } catch (error) {
    console.error('Error in visualSearchAction:', error);
    throw new Error('Failed to perform visual search.');
  }
}

export async function draftGenerationAction(
  data: DraftGenerationInput
): Promise<DraftGenerationOutput> {
  try {
    const result = await performDraftGeneration(data);
    return result;
  } catch (error) {
    console.error('Error in draftGenerationAction:', error);
    throw new Error('Failed to generate draft.');
  }
}
