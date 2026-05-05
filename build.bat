@echo off
chcp 65001 > nul
echo.
echo ================================================
echo   음악 타임라인 생성기 - 정적 빌드
echo ================================================
echo.

cd /d %~dp0

echo [1/2] Next.js 정적 빌드 중... (잠시 기다려주세요)
echo.
set STATIC_BUILD=1
set NEXT_PUBLIC_API_URL=
call npm run build

if errorlevel 1 (
    echo.
    echo ❌ 빌드 실패! 위 오류 메시지를 확인하세요.
    pause
    exit /b 1
)

echo.
echo [2/2] 빌드 완료!
echo.
echo ================================================
echo   이제부터 start.bat 를 실행하면 앱이 시작됩니다.
echo ================================================
echo.
pause
