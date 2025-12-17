'use server';
/**
 * @fileOverview This file defines the image analysis flow for listing items. It analyzes images and pre-fills item details.
 *
 * @exported
 * - `analyzeImagesToGenerateItemDetails`: Analyzes images to generate item details.
 * - `ImageAnalysisForListingInput`: Input type for the image analysis flow.
 * - `ImageAnalysisForListingOutput`: Output type for the image analysis flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ImageAnalysisForListingInputSchema = z.object({
  photoDataUris: z.array(z.string()).describe("Array of image data URIs (Base64 encoded)."),
});

export type ImageAnalysisForListingInput = z.infer<typeof ImageAnalysisForListingInputSchema>;

const ImageAnalysisForListingOutputSchema = z.object({
  brand: z.string().describe("Brand of the item.").optional(),
  model: z.string().describe("Model of the item.").optional(),
  style: z.string().describe("Style of the item.").optional(),
  color: z.string().describe("Color of the item.").optional(),
  gender: z.string().describe("Gender associated with the item.").optional(),
  condition: z.string().describe("Condition of the item.").optional(),
  description: z.string().describe("A detailed description of the item.").optional(),
});

export type ImageAnalysisForListingOutput = z.infer<typeof ImageAnalysisForListingOutputSchema>;

export async function analyzeImagesToGenerateItemDetails(
  input: ImageAnalysisForListingInput
): Promise<ImageAnalysisForListingOutput> {
  return imageAnalysisForListingFlow(input);
}

const imageAnalysisPrompt = ai.definePrompt({
  name: 'imageAnalysisPrompt',
  input: { schema: ImageAnalysisForListingInputSchema },
  output: { schema: ImageAnalysisForListingOutputSchema },
  prompt: `You are an AI assistant who is an expert at identifying products from images, similar to a Google Image Search. Your main goal is to identify the Brand and the exact Model of the item.

  Your task is to meticulously analyze the following images. Examine every part of the item, including the front, back, interior, and any tags (brand tags, care labels, size tags).
  From these images, extract the following information, prioritizing Brand and Model above all else:
  - **Brand:** The brand name of the item. This is critical.
  - **Model:** The specific model or name of the item. Be as precise as possible, as if you found the exact product page online.
  - **Style:** The type or style of the item (e.g., "sneaker", "duffel bag", "t-shirt").
  - **Color:** The primary color or colors of the item.
  - **Gender:** The target gender (e.g., "Womens", "Mens", "Unisex", "Kids").
  - **Condition:** The visual condition of the item (e.g., "New with tags", "Excellent used condition", "Good used condition").
  - **Description:** A detailed paragraph describing the item. Mention key features and materials (like cotton, polyester, leather).

  Images:
  {{#each photoDataUris}}
  {{media url=this}}
  {{/each}}
  `,
  model: 'googleai/gemini-2.5-flash-preview'
});

const imageAnalysisForListingFlow = ai.defineFlow(
  {
    name: 'imageAnalysisForListingFlow',
    inputSchema: ImageAnalysisForListingInputSchema,
    outputSchema: ImageAnalysisForListingOutputSchema,
  },
  async input => {
    const { output } = await imageAnalysisPrompt(input);
    return output!;
  }
);
