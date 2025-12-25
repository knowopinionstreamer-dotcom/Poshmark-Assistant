#!/bin/bash
# 🤖 Docker Builder Agent (v1.0)
# This agent handles professional builds, error detection, and health verification.

echo "🏗️  Docker Builder Agent: Starting build process..."

# 1. Run the build
docker-compose up -d --build 2> build_error.log

if [ $? -eq 0 ]; then
    echo "✅ Build successful. Initializing health check..."
    
    # 2. Wait for Next.js to be ready
    MAX_RETRIES=10
    COUNT=0
    until $(curl -sf http://localhost:3000 > /dev/null) || [ $COUNT -eq $MAX_RETRIES ]; do
        echo "⏳ Waiting for app to be reachable (Attempt $((COUNT+1))/$MAX_RETRIES)..."
        sleep 3
        COUNT=$((COUNT+1))
    done

    if [ $COUNT -eq $MAX_RETRIES ]; then
        echo "❌ Health check failed: App is not responding on port 3000."
        docker-compose logs poshmark-assistant | tail -n 20
        exit 1
    else
        echo "🚀 Docker Builder Agent: Build is LIVE and healthy at http://127.0.0.1:3000"
        exit 0
    fi
else
    echo "❌ Build failed. Inspecting errors..."
    cat build_error.log
    exit 1
fi
