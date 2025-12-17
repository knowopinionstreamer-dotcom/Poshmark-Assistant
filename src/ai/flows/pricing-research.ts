'use server';
/**
 * @fileOverview This file contains the Genkit flow for pricing research.
 *
 * - performPricingResearch - A function that initiates pricing research based on item description.
 * - performVisualSearch - A function that initiates visual search based on the uploaded image.
 * - PricingResearchInput - The input type for the performPricingResearch function.
 * - PricingResearchOutput - The return type for the performPricingResearch function.
 * - VisualSearchForPricingInput - The input type for the performVisualSearch function.
 * - VisualSearchForPricingOutput - The return type for the performVisualSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PricingResearchInputSchema = z.object({
  brand: z.string().describe('The brand of the item.'),
  model: z.string().describe('The model of the item.'),
});
export type PricingResearchInput = z.infer<typeof PricingResearchInputSchema>;

const PricingResearchOutputSchema = z.object({
  searchQueries: z.array(z.string()).describe('An array of search queries for eBay, Poshmark, and Mercari.'),
});
export type PricingResearchOutput = z.infer<typeof PricingResearchOutputSchema>;

const VisualSearchForPricingInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the item, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  condition: z.string().describe('The condition of the item (e.g., new, used).'),
  photoDataUris: z.array(z.string()).optional()
});
export type VisualSearchForPricingInput = z.infer<typeof VisualSearchForPricingInputSchema>;

const VisualSearchForPricingOutputSchema = z.object({
  searchResults: z.array(z.string()).describe('An array of search results from visual search.'),
});
export type VisualSearchForPricingOutput = z.infer<typeof VisualSearchForPricingOutputSchema>;

export async function performPricingResearch(input: PricingResearchInput): Promise<PricingResearchOutput> {
  return pricingResearchFlow(input);
}

export async function performVisualSearch(input: VisualSearchForPricingInput): Promise<VisualSearchForPricingOutput> {
    return visualSearchForPricing(input);
}

const pricingResearchPrompt = ai.definePrompt({
  name: 'pricingResearchPrompt',
  input: {schema: PricingResearchInputSchema},
  output: {schema: PricingResearchOutputSchema},
  prompt: `You are an expert reseller assistant. Generate search queries for eBay, Poshmark, and Mercari to research the pricing of an item.

  Brand: {{{brand}}}
  Model: {{{model}}}

  Return an array of search queries for these platforms. Make sure the search queries are specific to finding the price of the given item.
  `,
});

const pricingResearchFlow = ai.defineFlow(
  {
    name: 'pricingResearchFlow',
    inputSchema: PricingResearchInputSchema,
    outputSchema: PricingResearchOutputSchema,
  },
  async input => {
    const {output} = await pricingResearchPrompt(input);
    return output!;
  }
);

const visualSearchForPricingPrompt = ai.definePrompt({
  name: 'visualSearchForPricingPrompt',
  input: {schema: VisualSearchForPricingInputSchema},
  output: {schema: VisualSearchForPricingOutputSchema},
  prompt: `You are an expert in visual search for product listings.  Given the photo of the item, find similar listings and return the URL of those listings.

  Photo: {{media url=photoDataUri}}
  Condition: {{{condition}}}
  `,
});

const visualSearchForPricing = ai.defineFlow(
  {
    name: 'visualSearchForPricing',
    inputSchema: VisualSearchForPricingInputSchema,
    outputSchema: VisualSearchForPricingOutputSchema,
  },
  async input => {
    const {output} = await visualSearchForPricingPrompt(input);
    return output!;
  }
);
