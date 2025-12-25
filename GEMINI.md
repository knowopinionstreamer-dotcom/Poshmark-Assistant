# Poshmark Assistant Project

## Project Overview

**Poshmark Assistant** is a specialized "Reseller Command Center" web application designed to streamline the workflow of Poshmark resellers. It leverages AI to automate listing creation, pricing research, and inventory management.

The project is built as a self-hosted homelab application, containerized with Docker for easy deployment.

### Key Features
*   **AI Image Analysis:** Uses Google Gemini 1.5 via Genkit to analyze uploaded photos and extract item details (Brand, Model, Style, etc.).
*   **Draft Generation:** Automatically generates SEO-friendly titles and descriptions for Poshmark listings.
*   **Pricing Research:** (In development) AI-powered search to find comparable sold listings and suggest pricing.
*   **Inventory Management:** A local database (SQLite) to track drafted items, pricing history, and sales status.
*   **Homelab Ready:** Fully Dockerized for permanent running on a local server.

## Technical Architecture

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** TypeScript
*   **Database:** SQLite (via [Prisma ORM](https://www.prisma.io/))
*   **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) + Google GenAI SDK (Gemini 2.5 Flash)
*   **Styling:** Tailwind CSS + Shadcn UI (Radix Primitives)
*   **Containerization:** Docker + Docker Compose

## Directory Structure

*   `src/app`: Main Next.js application routes and React components.
    *   `page.tsx`: The main dashboard UI.
    *   `actions.ts`: Server Actions for AI flows (image analysis, pricing).
    *   `inventory-actions.ts`: Server Actions for database operations (saving items).
*   `src/ai`: Genkit AI flow definitions.
    *   `flows/`: specialized flows for `draft-generation`, `image-analysis`, etc.
*   `src/components`: Reusable UI components (buttons, inputs, etc.).
*   `src/lib`: Utility functions and the Prisma database client (`db.ts`).
*   `prisma`: Database configuration.
    *   `schema.prisma`: The data model definition.
    *   `dev.db`: The local SQLite database file (persisted via Docker volume).
*   `docs`: Project documentation (e.g., `blueprint.md`).

## Setup & Deployment

### Prerequisites
*   Docker & Docker Compose
*   A Google GenAI API Key

### Configuration
1.  Create a `.env` file in the root directory:
    ```bash
    GOOGLE_GENAI_API_KEY=your_actual_api_key_here
    DATABASE_URL="file:./dev.db"
    ```

### Running with Docker (Recommended)
This is the standard way to run the application for production/homelab use.

```bash
# Build and start the container in the background
docker-compose up -d --build

# View logs
docker logs -f poshmark-assistant

# Stop the application
docker-compose down
```
The app will be available at `http://localhost:3000`.

### Local Development (No Docker)
If you need to modify the code and test locally:

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Initialize the database:
    ```bash
    npx prisma generate
    npx prisma migrate dev --name init
    ```
3.  Start the dev server:
    ```bash
    npm run dev
    ```

## Development Conventions

*   **Database Changes:** If you modify `prisma/schema.prisma`, you must run `npx prisma migrate dev` (locally) or rebuild the Docker container to apply changes.
*   **AI Flows:** New AI features should be defined as flows in `src/ai/flows` and exposed via Server Actions in `src/app/actions.ts`.
*   **Persistence:** All persistent data must go through Prisma to the SQLite database. Do not rely on file system storage for user data, as the container file system is ephemeral (except for the mapped `prisma` volume).
