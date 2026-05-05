@echo off
chcp 65001 > nul
cd /d %~dp0

if not exist "out" (
    echo ❌ 빌드 파일이 없습니다. build.bat 를 먼저 실행하세요.
    pause
    exit /b 1
)

echo 🎵 음악 타임라인 생성기 시작 중...
.\venv\Scripts\python.exe timeline_extractor_backend.py
