@echo off
echo 🚀 Starting GitHub Clone Frontend...
echo =====================================

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🌐 Starting development server...
echo 📍 Frontend will be available at: http://localhost:5173
echo 🧪 Test page: http://localhost:5173/test
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev 