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
  styleNumber: z.string().optional().describe('The style number or SKU.'),
  style: z.string().describe('The style of the item.'),
  color: z.string().describe('The color of the item.'),
  size: z.string().optional().describe('The size of the item.'),
  gender: z.string().describe('The target gender for the item.'),
  condition: z.string().describe('The condition of the item.'),
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
  prompt: `You are an expert Poshmark listing strategist. Your goal is to maximize search traffic with ultra-clean, keyword-rich titles and professional descriptions.

### TASK 1: GENERATE TITLE
- **Format**: [Brand] [Model/Name] [Style Number] [Color]
- **Strict Rule**: NO visual descriptors (no "beautiful", "gorgeous", "amazing", etc.).
- **Clothing Rule**: Include [Size] and [Gender] ONLY if the item is clothing or footwear.
- **Keywords**: Use the most searchable technical names for the item.
- **Constraint**: Maximum 80 characters.

### TASK 2: GENERATE DESCRIPTION
- **Tone**: Light, friendly, and professional.
- **Emoji Style**: Use emojis sparingly (e.g., only at the start of section headers).
- **Constraint**: **ABSOLUTELY NO MENTION** of condition (New, Used, etc.).
- **Structure**:
  1. **Intro**: A welcoming 1-2 sentence summary hook about the item.
  2. **📦 Item Details**:
     - **Brand:** {{{brand}}}
     - **Model:** {{{model}}}
     - **Style Number:** {{{styleNumber}}}
     - **Style:** {{{style}}}
     - **Color:** {{{color}}}
     - **Size:** {{{size}}}
     - **Gender:** {{{gender}}}
  3. **✨ Highlights**:
     - Feature 1
     - Feature 2
     - Feature 3
  4. **Hashtags**: Add 5 trending hashtags at the very bottom.

**Inputs:**
- Brand: {{{brand}}}
- Model: {{{model}}}
- Style Number: {{{styleNumber}}}
- Style: {{{style}}}
- Color: {{{color}}}
- Size: {{{size}}}
- Gender: {{{gender}}}

Generate the title and description following these rules.
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