# 🚑 Homelab Recovery Blueprint (Stable 1.0)

This file contains everything needed to restore the Poshmark Assistant to a perfectly working state.

## 🔑 Critical Environment Info
- **Node Version:** 20 (Standard Image)
- **Database:** SQLite
- **Prisma Version:** 5.10.0 (Strict)
- **Port:** 3000
- **URL to use:** `http://127.0.0.1:3000` (Avoid `localhost` on Windows/WSL)

## 🛠️ Step-by-Step Restoration

If the app stops loading or shows errors:

1.  **Wipe the old state:**
    ```bash
    docker compose down --rmi all -v
    ```
2.  **Pull clean code:**
    ```bash
    git reset --hard origin/main
    ```
3.  **Check Dockerfile:** Ensure it starts with `FROM node:20`.
4.  **Rebuild:**
    ```bash
    docker compose up -d --build
    ```
5.  **Initialize Database:**
    ```bash
    docker exec -u root poshmark-assistant npx prisma@5.10.0 db push
    ```

## 📦 Core Dependencies (Working Mix)
- `next`: 15.5.9
- `@prisma/client`: 5.10.0
- `prisma`: 5.10.0 (Dev)
- `lucide-react`: latest (UI Icons)
- `tailwind`: latest

## 🧬 Key Files mapped in Obsidian:
- **Dockerfile:** Defines the environment.
- **docker-compose.yml:** Defines the networking and volumes.
- **schema.prisma:** Defines the database tables.
- **package.json:** Defines the software versions.
