# **App Name**: Poshmark Pro Lister

## Core Features:

- Multi-Image Uploader: Allows users to upload multiple images of an item via drag-and-drop or file dialog, displaying them in a carousel.
- AI Item Analysis: Automatically analyzes uploaded images using Gemini 1.5 to pre-fill item details (Brand, Model, Style, etc.). The tool leverages all images to create a description.
- Pricing Research: Uses AI and text search to research optimal pricing on platforms like eBay, Poshmark, and Mercari. It uses visual search to find the prices from similar listed items.
- Listing Draft Generation: Generates a draft title and description for the listing using all available item data.
- Data persistence and display: Uses React Hook Form and Zod to handle the forms.

## Style Guidelines:

- Primary color: Violet (#A06CD5), reminiscent of Poshmark, for a clean, 'Pro' aesthetic.
- Background color: Light Lavender (#F5EEFC), a desaturated tint of violet, providing a calm backdrop.
- Accent color: Electric Indigo (#6F00ED) for interactive elements, drawing attention without overwhelming the primary aesthetic.
- Body and headline font: 'Inter', a grotesque-style sans-serif, for a modern and neutral feel.
- Lucide-React icons: Simple, consistent icons for key actions and navigation.
- Responsive grid layout with a split view on desktop: Images on the left, data entry on the right. Mobile uses a single-column layout.
- Subtle loading animations: Skeleton loaders for AI actions, progress indicators for uploads, and toast notifications for success/error messages.