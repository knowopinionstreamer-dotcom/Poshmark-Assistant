import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: process.env.GOOGLE_GENAI_MODEL || 'googleai/gemini-2.0-flash',
});
