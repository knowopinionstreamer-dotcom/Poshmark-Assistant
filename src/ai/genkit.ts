import { genkit } from 'genkit';
import { ollama } from 'genkitx-ollama';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    ollama({
      serverAddress: process.env.OLLAMA_HOST || 'http://host.docker.internal:11434',
    }),
    googleAI(),
  ],
  model: process.env.OLLAMA_MODEL || 'ollama/llama3.2',
});