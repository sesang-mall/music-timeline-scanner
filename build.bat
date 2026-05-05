@echo off
cd /d %~dp0

echo.
echo ================================================
echo   Music Timeline - Static Build
echo ================================================
echo.
echo [1/2] Building Next.js static files...
echo.

set STATIC_BUILD=1
set NEXT_PUBLIC_API_URL=
call npm run build

if errorlevel 1 (
    echo.
    echo [FAILED] Build failed. Check the error above.
    pause
    exit /b 1
)

echo.
echo [2/2] Build complete!
echo.
echo ================================================
echo   Run start.bat to launch the app.
echo ================================================
echo.
pause
