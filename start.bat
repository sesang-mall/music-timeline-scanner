@echo off
cd /d %~dp0

if not exist "out" (
    echo [ERROR] Build files not found. Run build.bat first.
    pause
    exit /b 1
)

echo Starting Music Timeline app...
.\venv\Scripts\python.exe timeline_extractor_backend.py
