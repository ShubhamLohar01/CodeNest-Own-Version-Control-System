#!/bin/bash

echo "🚀 Starting GitHub Clone Frontend..."
echo "====================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🌐 Starting development server..."
echo "📍 Frontend will be available at: http://localhost:5173"
echo "🧪 Test page: http://localhost:5173/test"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev 