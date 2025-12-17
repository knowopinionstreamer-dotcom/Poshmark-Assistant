'use server';
/**
 * @fileOverview Generates a draft listing title and description based on item details.
 *
 * - performDraftGeneration - A function that triggers the listing draft generation process.
 * - DraftGenerationInput - The input type for the performDraftGeneration function.
 * - DraftGenerationOutput - The return type for the performDraftGeneration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const DraftGenerationInputSchema = z.object({
  brand: z.string().describe('The brand of the item.'),
  model: z.string().describe('The model of the item.'),
  style: z.string().describe('The style of the item.'),
  color: z.string().describe('The color of the item.'),
  gender: z.string().describe('The target gender for the item (e.g., male, female, unisex).'),
  condition: z.string().describe('The condition of the item (e.g., new with tags, used).'),
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
  prompt: `You are an expert Poshmark listing content creator. Your tasks are to:
1.  **Generate a Title**: You are an expert content extractor, specifically tasked with isolating and presenting a suggested title from a larger body of generated listing content. Your goal is to extract only the title, ensuring it is clearly formatted and ready for direct copying and pasting. The title should typically include the Brand, item type, model, style, color, and applicable gender (men's, women's, or kids), and size.
Read the provided Generate Poshmark Listing carefully.
Identify and extract only the suggested title from the Generate Poshmark Listing. Ensure the extracted Title includes the Brand, item type, model, style, color, and applicable gender (men's, women's, or kids), and size, if available in the content.
Output the extracted Title as a clear, copy-pasteable text section, with no additional formatting or surrounding text.
2.  **Generate a Description**: You are an expert Poshmark listing content extractor. Your task is to precisely extract only the detailed description, including the required disclaimer formatted as a list, from the provided 'Generate Poshmark Listing Content' output. The extracted description should be formatted as a clear, copy-pasteable text section, ready for direct use, and the total length of the description and disclaimer combined must be less than 1000 characters.

Carefully read and understand the entire content of the provided Generate Poshmark Listing.
Identify the section within the Generate Poshmark Listing that constitutes the detailed description of the item. This description should include all key features, condition details, and the mandatory disclaimer.
Extract only this detailed Description and the required disclaimer.
Format the extracted disclaimer as a list.
Present the extracted description and the list-formatted disclaimer as a single, contiguous block of text, ensuring it is clean and directly copy-pasteable without any additional formatting or surrounding text.
Check the total character count of the extracted description and disclaimer. If the combined length is 1000 characters or more, go back to step 3 and re-extract, ensuring the combined length is less than 1000 characters.


  **Item Details:**
  - Brand: {{{brand}}}
  - Model: {{{model}}}
  - Style: {{{style}}}
  - Color: {{{color}}}
  - Gender: {{{gender}}}
  - Condition: {{{condition}}}

  Based on these details, generate the title and description.
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
