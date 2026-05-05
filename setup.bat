@echo off
REM 음악 타임라인 스캐너 - Windows 자동 설정 스크립트
REM 이 배치 파일을 프로젝트 폴더에서 실행하세요

echo.
echo ====================================
echo 음악 타임라인 스캐너 설정을 시작합니다
echo ====================================
echo.

REM 1. app 폴더 생성
echo [1/5] app 폴더 생성 중...
if not exist "app" (
    mkdir app
    echo ✓ app 폴더 생성 완료
) else (
    echo ✓ app 폴더가 이미 있습니다
)

REM 2. 파일 이동
echo.
echo [2/5] 파일 이동 중...
if exist "page.jsx" (
    move /Y page.jsx app\page.jsx >nul 2>&1
    echo ✓ page.jsx 이동 완료
)

if exist "layout.jsx" (
    move /Y layout.jsx app\layout.jsx >nul 2>&1
    echo ✓ layout.jsx 이동 완료
)

if exist "globals.css" (
    move /Y globals.css app\globals.css >nul 2>&1
    echo ✓ globals.css 이동 완료
)

REM 3. Python 가상환경 생성
echo.
echo [3/5] Python 가상환경 생성 중...
if not exist "venv" (
    python -m venv venv
    echo ✓ 가상환경 생성 완료
) else (
    echo ✓ 가상환경이 이미 있습니다
)

REM 4. Python 의존성 설치
echo.
echo [4/5] Python 의존성 설치 중...
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
echo ✓ Python 의존성 설치 완료

REM 5. Node.js 의존성 설치
echo.
echo [5/5] Node.js 의존성 설치 중...
if not exist "node_modules" (
    npm install -q
    echo ✓ Node.js 의존성 설치 완료
) else (
    echo ✓ node_modules가 이미 있습니다
)

REM 완료
echo.
echo ====================================
echo ✅ 설정이 완료되었습니다!
echo ====================================
echo.
echo 📁 최종 폴더 구조:
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
echo 🚀 이제 다음 명령으로 앱을 실행하세요:
echo.
echo   터미널 1 (백엔드):
echo   venv\Scripts\activate
echo   python timeline_extractor_backend.py
echo.
echo   터미널 2 (프론트엔드):
echo   npm run dev
echo.
echo 🌐 브라우저에서 http://localhost:3100 을 열어보세요!
echo.
pause
