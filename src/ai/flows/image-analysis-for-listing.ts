import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ImageAnalysisForListingInputSchema = z.object({
  photoDataUris: z.array(z.string()).describe("Array of image data URIs (Base64 encoded)."),
});

export type ImageAnalysisForListingInput = z.infer<typeof ImageAnalysisForListingInputSchema>;

const ImageAnalysisForListingOutputSchema = z.object({
  brand: z.string().describe("Brand of the item.").optional(),
  model: z.string().describe("Model of the item.").optional(),
  styleNumber: z.string().describe("Specific style number, SKU, or RN found on tags.").optional(),
  visualSearchQuery: z.string().describe("The exact string you would type into a Google Image search bar to find this identical item.").optional(),
  style: z.string().describe("Style of the item.").optional(),
  color: z.string().describe("Color of the item.").optional(),
  gender: z.string().describe("Gender associated with the item.").optional(),
  condition: z.string().describe("Condition of the item.").optional(),
  description: z.string().describe("A detailed description of the item.").optional(),
});

export type ImageAnalysisForListingOutput = z.infer<typeof ImageAnalysisForListingOutputSchema>;

const imageAnalysisPrompt = ai.definePrompt({
  name: 'imageAnalysisPrompt',
  input: { schema: ImageAnalysisForListingInputSchema },
  output: { schema: ImageAnalysisForListingOutputSchema },
  prompt: `You are an expert product image analyst working as part of an automated AI system. 

  ### OUTPUT RULES
  - NO CHIT-CHAT.
  - NO EXPLAINING what you are doing or why.
  - DO NOT start with "Okay", "Alright", or any preambles. 
  - PROVIDE ONLY the structured data requested.

  ### STEP-BY-STEP INSTRUCTIONS
  1. **Systematic Scan**: Carefully analyze all provided Product Images. Scour every corner for brand tags, care labels, size stickers, and unique hardware or patterns.
  2. **Identity Extraction**: Identify the core characteristics: Brand, Model Name, and any specific Style Number/SKU found on tags.
  3. **Visual Query Formulation**: Create a "Visual Search Query"—the exact 5-8 word string you would type into a Google Image search bar to find this identical item.
  4. **Contextual Analysis**: 
     - **Style, Color, Condition**: Extract standard details.
     - **Gender**: Provide "Womens", "Mens", "Unisex", or "Kids" ONLY if the item is clothing or shoes. Leave BLANK for all other items.
     - **Size**: Provide the size ONLY if it is clearly visible or confirmed.
  5. **Structured Summary**: Present all technical features and materials in a professional, concise description.

  ### DATA TO EXTRACT
  - **Brand**: Confirmed brand name.
  - **Model**: Specific product name or line.
  - **StyleNumber**: Exact SKU/Style code from the tags.
  - **VisualSearchQuery**: The engineered Google Image search string.
  - **Style, Color, Gender, Condition**: Core details.
  - **Description**: A meticulous summary of technical features.

  Product Images:
  {{#each photoDataUris}}
  {{media url=this}}
  {{/each}}
  `,
  model: 'googleai/gemini-1.5-pro',
});

export async function analyzeImagesToGenerateItemDetails(
  input: ImageAnalysisForListingInput
): Promise<ImageAnalysisForListingOutput> {
  return imageAnalysisForListingFlow(input);
}

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
