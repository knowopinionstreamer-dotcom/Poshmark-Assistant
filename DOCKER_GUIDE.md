# 🐳 Docker Launch Guide (Poshmark Assistant)

This guide explains how to launch and manage your Poshmark Assistant using Docker directly.

## 🚀 Quick Start
To launch the application in the background:
```bash
docker-compose up -d --build
```

## 🛠 Management Commands

### Stop the App
```bash
docker-compose down
```

### View Real-time Logs
```bash
docker logs -f poshmark-assistant
```

### Restart the App
```bash
docker-compose restart poshmark-assistant
```

### Update the App
If you've made code changes and need to rebuild:
```bash
docker-compose up -d --build
```

## 🌐 Accessing the App
Once started, the app is available at:
**Address:** [http://127.0.0.1:3000](http://127.0.0.1:3000)

## 🗄 Persistence
- **Database:** Your inventory and settings are stored in `prisma/dev.db`. This file is mapped to the container to ensure data persists even if the container is deleted.
- **Environment:** Ensure your `.env` file contains your `GOOGLE_GENAI_API_KEY`.
