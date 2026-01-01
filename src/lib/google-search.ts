import { z } from 'zod';

const GOOGLE_SEARCH_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const GOOGLE_SEARCH_CX = process.env.GOOGLE_SEARCH_CX;

export interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
  pagemap?: {
    offer?: {
      price?: string;
      pricecurrency?: string;
    }[];
    metatags?: {
      [key: string]: string;
    }[];
  };
}

export async function googleSearch(query: string): Promise<GoogleSearchResult[]> {
  if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_CX) {
    console.warn('Google Search API keys are missing. Skipping real search.');
    return [];
  }

  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Search API failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error performing Google Search:', error);
    return [];
  }
}
