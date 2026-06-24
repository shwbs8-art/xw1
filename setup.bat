@echo off
title Minecraft Admin Bot - Setup
color 0A
echo ========================================
echo   Minecraft Admin Bot - Setup (Windows)
echo ========================================
echo.

echo [1/3] Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo.
    echo Please install Node.js:
    echo 1. Go to https://nodejs.org/
    echo 2. Download LTS version
    echo 3. Install and restart CMD
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js found!

echo.
echo [2/3] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo [OK] Dependencies installed!

echo.
echo [3/3] Setup complete!
echo.

echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Edit bot.js and add your settings
echo 2. Run: node bot.js
echo.
echo IMPORTANT:
echo - Add your Discord Token in bot.js
echo - Make sure Minecraft server is online
echo.
pause
