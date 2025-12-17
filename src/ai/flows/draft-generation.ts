'use server';
/**
 * @fileOverview Generates a draft listing title and description based on item details.
 *
 * - performDraftGeneration - A function that triggers the listing draft generation process.
 * - DraftGenerationInput - The input type for the performDraftGeneration function.
 * - DraftGenerationOutput - The return type for the performDraftGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftGenerationInputSchema = z.object({
  brand: z.string().describe('The brand of the item.'),
  model: z.string().describe('The model of the item.'),
  style: z.string().describe('The style of the item.'),
  color: z.string().describe('The color of the item.'),
  gender: z.string().describe('The target gender for the item (e.g., male, female, unisex).'),
  condition: z.string().describe('The condition of the item (e.g., new with tags, used).'),
  targetPrice: z.number().describe('The target price for the item in USD.'),
});
export type DraftGenerationInput = z.infer<typeof DraftGenerationInputSchema>;

const DraftGenerationOutputSchema = z.object({
  title: z.string().describe('The generated title for the listing.'),
  description: z.string().describe('The generated description for the listing.'),
});
export type DraftGenerationOutput = z.infer<typeof DraftGenerationOutputSchema>;

export async function performDraftGeneration(input: DraftGenerationInput): Promise<DraftGenerationOutput> {
  return draftGenerationFlow(input);
}

const draftGenerationPrompt = ai.definePrompt({
  name: 'draftGenerationPrompt',
  input: {schema: DraftGenerationInputSchema},
  output: {schema: DraftGenerationOutputSchema},
  prompt: `You are an expert content extractor, specifically tasked with isolating and presenting a suggested title from a larger body of generated listing content. Your goal is to extract only the title, ensuring it is clearly formatted and ready for direct copying and pasting. The title should typically include the Brand, item type, model, style, color, and applicable gender (men's, women's, or kids), and size.

Read the provided Generate Poshmark Listing carefully.
Identify and extract only the suggested title from the Generate Poshmark Listing. Ensure the extracted Title includes the Brand, item type, model, style, color, and applicable gender (men's, women's, or kids), and size, if available in the content.
Output the extracted Title as a clear, copy-pasteable text section, with no additional formatting or surrounding text.

  Item Details:
  Brand: {{{brand}}}
  Model: {{{model}}}
  Style: {{{style}}}
  Color: {{{color}}}
  Gender: {{{gender}}}
  Condition: {{{condition}}}
  Target Price: {{{targetPrice}}}
  `,
});

const draftGenerationFlow = ai.defineFlow(
  {
    name: 'draftGenerationFlow',
    inputSchema: DraftGenerationInputSchema,
    outputSchema: DraftGenerationOutputSchema,
  },
  async input => {
    const {output} = await draftGenerationPrompt(input);
    return output!;
  }
);
