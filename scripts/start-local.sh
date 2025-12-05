#!/bin/bash

# Start services locally without Docker
# Make sure you're in the project root directory

echo "🚀 Starting Expense Tracker locally (Firestore mode)..."
echo ""

# Load environment variables
if [ -f environments/.env ]; then
    export $(cat environments/.env | grep -v '^#' | xargs)
    echo "✓ Loaded environment variables from environments/.env"
else
    echo "❌ environments/.env not found!"
    exit 1
fi

# Check if services are installed
if [ ! -d "app/services/auth-service/node_modules" ] || [ ! -d "app/services/api-service/node_modules" ] || [ ! -d "app/frontend/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    cd app/services/auth-service && npm install && cd ../../..
    cd app/services/api-service && npm install && cd ../../..
    cd app/frontend && npm install && cd ../..
    echo "✓ Dependencies installed"
    echo ""
fi

# Kill any existing processes on our ports
echo "🔍 Checking for existing processes..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
echo "✓ Ports cleared"
echo ""

# Start services using npm workspaces
echo "🎯 Starting services..."
echo ""
echo "📍 Auth Service:    http://localhost:3001"
echo "📍 API Service:     http://localhost:3002"
echo "📍 Frontend:        http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Use npm run dev which starts all services with concurrently
npm run dev
