# 🚀 Quick Start Guide

Follow these steps to access and start your Poshmark Assistant app.

### 1. Open this Distro
Open your Windows Terminal or PowerShell and type:
```bash
wsl -d UbuntuCLI
```

### 2. Navigate to the Folder
Once inside the terminal, go to your project folder:
```bash
cd ~/Poshmark-Assistant-LATEST
```

### 3. Docker Commands (The Controls)

**Start the App (Normal):**
```bash
docker-compose up -d
```

**Stop the App:**
```bash
docker-compose down
```

**Restart & Rebuild (Use this if you change settings/code):**
```bash
docker-compose up --build -d
```

**View Live Logs (See what the AI is thinking):**
```bash
docker-compose logs -f
```

**Check if App is Running:**
```bash
docker ps
```

### 4. Access the App
Open your browser and go to:
**http://127.0.0.1:3000**
