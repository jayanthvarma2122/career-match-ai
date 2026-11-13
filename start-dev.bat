@echo off
title CareerMatch AI - Development Launcher
echo ========================================================
echo     🚀 Starting CareerMatch AI Full-Stack Environment
echo ========================================================
echo.

echo [1/2] Launching Backend Server on Port 5000...
start "CareerMatch AI Backend" cmd /k "cd backend && npm run dev"

timeout /t 2 /nobreak >nul

echo [2/2] Launching Frontend (Vite) on Port 5173...
start "CareerMatch AI Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo ✅ Both services launched!
echo 🔗 Frontend App: http://localhost:5173
echo 🔗 Backend API:  http://localhost:5000/api
echo ========================================================
echo.
pause

