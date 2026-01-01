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
import { googleSearch } from '@/lib/google-search';

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
  input: {
    schema: PricingResearchInputSchema.extend({
      searchResults: z.string().optional().describe('Real-time search results from Google.'),
    }),
  },
  output: {schema: PricingResearchOutputSchema},
  prompt: `You are an expert reseller strategist. Your goal is to provide a "Market Intel Report" based on REAL search data.

### INPUT DATA
- Item: {{{brand}}} {{{model}}} {{{styleNumber}}} (Size: {{{size}}})
- Condition: {{{condition}}}
- **REAL MARKET DATA:** 
{{{searchResults}}}

### TASK 1: ANALYZE SEARCH RESULTS
Review the provided "REAL MARKET DATA" above. Look for prices in the titles or snippets.
If you see prices (e.g., "$45", "Sold for $50"), use them to calculate your suggestion.

### TASK 2: MARKET INTELLIGENCE
1. **Demand Rating**: Rate the item's liquidity based on the search results.
2. **Value Drivers**: Identify 2-3 specific reasons for the price (e.g., "Sold out on official site", "High resale value seen in search").
3. **Match Count**: How many relevant results did you find in the provided data?

### TASK 3: OPTIMAL PRICING
- **Determine an optimal listing price**: Base this strictly on the search results provided. If no prices are in the results, estimate based on brand value.
- **Formulate a clear explanation**: "Based on 5 search results, the average price is..."

**Return the output as JSON.**
  `,
});

const pricingResearchFlow = ai.defineFlow(
  {
    name: 'pricingResearchFlow',
    inputSchema: PricingResearchInputSchema,
    outputSchema: PricingResearchOutputSchema,
  },
  async input => {
    // 1. Construct the search query
    const query = `${input.brand} ${input.model} ${input.styleNumber || ''} ${input.visualSearchQuery || ''} price`.trim();
    
    // 2. Perform the Google Search
    console.log(`🔍 Searching Google for: "${query}"...`);
    const results = await googleSearch(query);
    
    // 3. Format results for the LLM
    const formattedResults = results.map(r => 
      `- Title: ${r.title}\n  Snippet: ${r.snippet}\n  Link: ${r.link}`
    ).join('\n\n');

    // 4. Call the LLM with the search data
    const {output} = await pricingResearchPrompt({
      ...input,
      searchResults: formattedResults || "No search results found.",
    }, {
      config: {
        temperature: 0.2, 
      }
    });
    return output!;
  }
);
