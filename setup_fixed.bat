@echo off
REM Auto setup script for Music Timeline Scanner
REM Run this file in the project folder

echo.
echo ====================================
echo Setup Music Timeline Scanner
echo ====================================
echo.

REM 1. Create app folder
echo [1/5] Creating app folder...
if not exist "app" (
    mkdir app
    echo OK: app folder created
) else (
    echo OK: app folder already exists
)

REM 2. Move files
echo.
echo [2/5] Moving files...
if exist "page.jsx" (
    move /Y page.jsx app\page.jsx >nul 2>&1
    echo OK: page.jsx moved
)

if exist "layout.jsx" (
    move /Y layout.jsx app\layout.jsx >nul 2>&1
    echo OK: layout.jsx moved
)

if exist "globals.css" (
    move /Y globals.css app\globals.css >nul 2>&1
    echo OK: globals.css moved
)

REM 3. Create Python virtual environment
echo.
echo [3/5] Creating Python virtual environment...
if not exist "venv" (
    python -m venv venv
    echo OK: Virtual environment created
) else (
    echo OK: Virtual environment already exists
)

REM 4. Install Python dependencies
echo.
echo [4/5] Installing Python dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
echo OK: Python dependencies installed

REM 5. Install Node.js dependencies
echo.
echo [5/5] Installing Node.js dependencies...
if not exist "node_modules" (
    npm install -q
    echo OK: Node.js dependencies installed
) else (
    echo OK: node_modules already exists
)

REM Completed
echo.
echo ====================================
echo SUCCESS: Setup completed!
echo ====================================
echo.
echo Final folder structure:
echo   D:\Claude_Dev\music-timeline-scanner\
echo   ├── app\
echo   │   ├── page.jsx
echo   │   ├── layout.jsx
echo   │   └── globals.css
echo   ├── venv\
echo   ├── node_modules\
echo   ├── package.json
echo   ├── .env
echo   ├── requirements.txt
echo   └── timeline_extractor_backend.py
echo.
echo Next steps:
echo.
echo Terminal 1 (Backend):
echo   venv\Scripts\activate
echo   python timeline_extractor_backend.py
echo.
echo Terminal 2 (Frontend):
echo   npm run dev
echo.
echo Then open: http://localhost:3100
echo.
pause
