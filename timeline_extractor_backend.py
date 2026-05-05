from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import mutagen
from pathlib import Path
import os
import threading
import webbrowser
from dotenv import load_dotenv
import tkinter as tk
from tkinter import filedialog

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPPORTED_FORMATS = {'.mp3', '.wav', '.m4a', '.flac', '.aac', '.ogg', '.wma'}

def get_duration(file_path: str) -> float:
    """mutagen으로 정확한 오디오 길이 반환 (단위: 초, float)"""
    audio = mutagen.File(file_path)
    if audio is None or not hasattr(audio, 'info') or not hasattr(audio.info, 'length'):
        raise ValueError(f"지원하지 않는 형식이거나 duration을 읽을 수 없음: {file_path}")
    return float(audio.info.length)

def format_time(seconds: float) -> str:
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}"

def format_duration(seconds: float) -> str:
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes}:{secs:02d}"

@app.post("/api/timeline-from-folder")
async def timeline_from_folder(data: dict):
    """
    폴더 내 음악 파일을 이름순으로 정렬하고,
    각 파일의 duration을 누적해서 타임라인 생성
    """
    folder_path = data.get("folder_path", "").strip()

    if not folder_path:
        return JSONResponse({"error": "폴더 경로를 입력하세요"}, status_code=400)

    path = Path(folder_path).resolve()

    if not path.exists():
        return JSONResponse({"error": f"폴더를 찾을 수 없습니다: {path}"}, status_code=400)
    if not path.is_dir():
        return JSONResponse({"error": "폴더 경로가 유효하지 않습니다"}, status_code=400)

    music_files = sorted(
        [f for f in path.iterdir() if f.is_file() and f.suffix.lower() in SUPPORTED_FORMATS]
    )

    if not music_files:
        return JSONResponse({"error": "음악 파일을 찾을 수 없습니다"}, status_code=400)

    timeline = []
    cumulative = 0.0
    errors = []

    for i, file_path in enumerate(music_files):
        try:
            duration = get_duration(str(file_path))
            timeline.append({
                "index": i + 1,
                "time": format_time(cumulative),
                "seconds": cumulative,           # 완전 정밀도 유지
                "title": file_path.stem,
                "filename": file_path.name,
                "duration_seconds": duration,    # 완전 정밀도 유지
                "duration": format_duration(duration),
            })
            cumulative += duration
        except Exception as e:
            errors.append(f"{file_path.name}: {str(e)}")

    return {
        "success": True,
        "total_files": len(timeline),
        "total_duration": format_time(cumulative),
        "timeline": timeline,
        "errors": errors,
    }

@app.post("/api/export")
async def export_timeline(data: dict):
    """타임라인을 TXT로 변환"""
    try:
        timeline = data.get("timeline", [])
        txt_content = ""
        for item in timeline:
            txt_content += f"{item['time']} {item['title']}\n"
        return {"success": True, "content": txt_content, "filename": "timeline.txt"}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

@app.post("/api/export-csv")
async def export_csv(data: dict):
    """타임라인을 CSV로 변환 (UTF-8 BOM, Excel 한글 호환)"""
    try:
        timeline = data.get("timeline", [])
        csv_content = "﻿번호,시작시간(HH:MM:SS),시작시간(프레임30fps),곡제목,곡길이,파일명\n"
        for item in timeline:
            title = item['title'].replace(',', ' ')
            filename = item['filename'].replace(',', ' ')
            time_frame = item.get('timeFrame', item['time'])
            csv_content += f"{item['index']},{item['time']},{time_frame},{title},{item['duration']},{filename}\n"
        return {"success": True, "content": csv_content, "filename": "timeline.csv"}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

@app.get("/api/browse-folder")
def browse_folder():
    """시스템 폴더 선택 다이얼로그를 열고 선택된 경로를 반환"""
    try:
        root = tk.Tk()
        root.withdraw()
        root.wm_attributes('-topmost', True)
        path = filedialog.askdirectory(title="음악 폴더 선택")
        root.destroy()
        if path:
            return {"success": True, "path": path}
        return {"success": False, "path": ""}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.get("/health")
def health_check():
    return {"status": "ok"}

# ── 정적 빌드 서빙 (npm run build 후 out/ 폴더가 있을 때) ──
OUT_DIR = Path(__file__).parent / "out"
if OUT_DIR.exists():
    # Next.js 정적 에셋 (_next/)
    _next_dir = OUT_DIR / "_next"
    if _next_dir.exists():
        app.mount("/_next", StaticFiles(directory=str(_next_dir)), name="nextjs-assets")

    # 루트 → index.html
    @app.get("/")
    def serve_index():
        return FileResponse(str(OUT_DIR / "index.html"))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 3102))

    # out/ 폴더가 있으면 브라우저 자동 오픈 (정적 빌드 모드)
    if OUT_DIR.exists():
        def _open_browser():
            import time
            time.sleep(1.5)
            webbrowser.open(f"http://localhost:{port}")
        threading.Thread(target=_open_browser, daemon=True).start()
        print(f"\n✅ 정적 빌드 모드 — http://localhost:{port} 에서 실행 중\n")
    else:
        print(f"\n⚠️  개발 모드 — 프론트엔드를 별도로 실행하세요 (npm run dev)\n")

    uvicorn.run(app, host="0.0.0.0", port=port)
