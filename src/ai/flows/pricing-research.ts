'use server';
/**
 * @fileOverview This file contains the Genkit flow for pricing research.
 *
 * - performPricingResearch - A function that initiates pricing research based on item description.
 * - PricingResearchInput - The input type for the performPricingResearch function.
 * - PricingResearchOutput - The return type for the performPricingResearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PricingResearchInputSchema = z.object({
  brand: z.string().describe('The brand of the item.'),
  model: z.string().describe('The model of the item.'),
  size: z.string().optional().describe('The size of the item.'),
  condition: z.string().describe('The condition of the item (e.g., new, used).'),
});
export type PricingResearchInput = z.infer<typeof PricingResearchInputSchema>;

const PricingResearchOutputSchema = z.object({
  searchQueries: z.array(z.string()).describe('An array of search URLs for eBay, Poshmark, and Mercari/Amazon.'),
  suggestedPrice: z.number().optional().describe('The suggested price for the item based on research.'),
});
export type PricingResearchOutput = z.infer<typeof PricingResearchOutputSchema>;

export async function performPricingResearch(input: PricingResearchInput): Promise<PricingResearchOutput> {
  return pricingResearchFlow(input);
}

const pricingResearchPrompt = ai.definePrompt({
  name: 'pricingResearchPrompt',
  input: {schema: PricingResearchInputSchema},
  output: {schema: PricingResearchOutputSchema},
  prompt: `You are an expert reseller assistant. Your tasks are to:
  1. Generate search URLs for various marketplaces to help a user research the price of an item.
  2. Suggest a competitive listing price based on the provided item details.

  You will be given the item's brand, model, size, and condition.

  Item Details:
  - Brand: {{{brand}}}
  - Model: {{{model}}}
  - Size: {{{size}}}
  - Condition: {{{condition}}}

  Instructions for Search URLs:
  1. Create a search query string that includes the brand, model, and size (if available).
  2. Based on the item's condition, generate search URLs for the appropriate platforms:
     - If the condition is 'New with tags', 'New', or similar, generate URLs for Poshmark, eBay, and Amazon.
     - If the condition is 'Used', 'Excellent used condition', or similar, generate URLs for Poshmark, eBay, and Mercari.
  3. Format the output as a JSON object containing an array of these URLs.

  Instructions for Suggested Price:
  - Based on your knowledge of online marketplaces and the item details, determine a realistic and competitive selling price.
  - The price should be a number, without any currency symbols.

  Example query: "Nike Air Max 90 10.5"
  Example URL for Poshmark: "https://poshmark.com/search?query=Nike+Air+Max+90+10.5"
  Example URL for eBay: "https://www.ebay.com/sch/i.html?_nkw=Nike+Air+Max+90+10.5"
  Example URL for Mercari: "https://www.mercari.com/search/?keyword=Nike+Air+Max+90+10.5"
  Example URL for Amazon: "https://www.amazon.com/s?k=Nike+Air+Max+90+10.5"
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
