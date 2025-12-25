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
  styleNumber: z.string().optional().describe('Specific style number or SKU.'),
  visualSearchQuery: z.string().optional().describe('The precise query string identified by AI analysis.'),
  size: z.string().optional().describe('The size of the item.'),
  condition: z.string().describe('The condition of the item (e.g., new, used).'),
});
export type PricingResearchInput = z.infer<typeof PricingResearchInputSchema>;

const PricingResearchOutputSchema = z.object({
  searchQueries: z.array(z.string()).describe('An array of search URLs for eBay, Poshmark, and Mercari.'),
  suggestedPrice: z.number().optional().describe('The suggested price for the item based on research.'),
  demand: z.string().optional().describe('Market demand rating (e.g., Hot Seller, Slow & Steady).'),
  valueDrivers: z.array(z.string()).optional().describe('Key reasons for the price (e.g., Rare color, High demand).'),
  matchCount: z.number().optional().describe('Number of exact matches found during research.'),
  priceExplanation: z.string().optional().describe('A detailed, copy-pasteable explanation of how the price was determined.'),
});
export type PricingResearchOutput = z.infer<typeof PricingResearchOutputSchema>;

export async function performPricingResearch(input: PricingResearchInput): Promise<PricingResearchOutput> {
  return pricingResearchFlow(input);
}

const pricingResearchPrompt = ai.definePrompt({
  name: 'pricingResearchPrompt',
  input: {schema: PricingResearchInputSchema},
  output: {schema: PricingResearchOutputSchema},
  prompt: `You are an expert reseller strategist. Your goal is to provide a "Market Intel Report."

### TASK 1: SEARCH LINKS
Generate URLs for Poshmark (Sold), eBay (Sold), Mercari, and Amazon using ONLY "{{brand}} {{model}}".

### TASK 2: MARKET INTELLIGENCE
1. **Demand Rating**: Rate the item's liquidity. 
2. **Value Drivers**: Identify 2-3 specific reasons for the price.
3. **Match Count**: Based on your knowledge and the style number, estimate how many "Exact Matches" currently exist in the sold market history.

### TASK 3: OPTIMAL PRICING
- **Determine an optimal listing price**: Consider factors such as condition ({{{condition}}}), brand ({{{brand}}}), demand, and competitive pricing among both new and used items.
- **Formulate a clear explanation**: Reference the market values and findings from your internal research.
- **Combine**: Merge the determined optimal listing price and its explanation into a single, clear, copy-pasteable text section.

**Inputs:**
- Brand: {{{brand}}}
- Model: {{{model}}}
- Visual Search Query: {{{visualSearchQuery}}}
- Style Number: {{{styleNumber}}}
- Size: {{{size}}}
- Condition: {{{condition}}}
  `,
});

const pricingResearchFlow = ai.defineFlow(
  {
    name: 'pricingResearchFlow',
    inputSchema: PricingResearchInputSchema,
    outputSchema: PricingResearchOutputSchema,
  },
  async input => {
    const {output} = await pricingResearchPrompt(input, {
      config: {
        temperature: 0, // Enforce consistent, non-random results
      }
    });
    return output!;
  }
);
