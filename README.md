# Poshmark Assistant

This repository contains the source code for the Poshmark Assistant, a web application designed to streamline the creation of Poshmark listings using AI.

## Core Features

*   **AI-Powered Detail Extraction:** Upload product photos and have the AI automatically identify item characteristics.
*   **Intelligent Pricing Research:** Generate targeted search queries for various platforms to determine the optimal selling price.
*   **Automated Draft Generation:** Create compelling titles and descriptions for your listings with a single click.
*   **Dockerized Environment:** The entire application and its services run in a containerized environment using Docker Compose.
*   **Obsidian Integration:** An included agent automatically syncs key project files and documentation to a dedicated Obsidian vault for easy reference.

## Technology Stack

*   **Framework:** Next.js
*   **Language:** TypeScript
*   **AI Backend:** Genkit (configurable for Ollama or Google Gemini)
*   **Database:** Prisma
*   **Deployment:** Docker
*   **File Sync:** Custom Node.js script
