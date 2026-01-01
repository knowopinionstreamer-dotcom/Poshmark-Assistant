# 📜 Project Changelog

## [2.0.0] - 2026-01-01 (In Progress)
### 🚀 Architectural Overhaul
- **Switch to Ollama:** Migrating all core AI logic from the Google Gemini API to a local Ollama instance for greater control and to eliminate API quotas.
- **Implement Custom Search API:** The image analysis step will be upgraded to use the Google Custom Search API for more accurate and targeted pricing research.
- **New Vault & Docs:** Established a new, clean Obsidian vault and added comprehensive `README.md`, `INSTRUCTIONS.md`, and `COMMANDS.md` files.
- **Unified Codebase:** Consolidated all work into a single, cohesive application based on the latest GitHub version.

## [1.0.0] - 2025-12-24
### ✨ Stable 1.0 Release
- **Fixed Networking:** App now uses Standard Node 20 image and 127.0.0.1 for stability.
- **Sidebar UI:** Re-added the sidebar and dashboard layout.
- **Dark Mode:** Deep blue dark theme enabled.
- **Database:** Persistent SQLite storage for inventory.
- **Obsidian Agent:** Automatic backup of code blueprints and manuals to Obsidian.
