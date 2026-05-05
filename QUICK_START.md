# ⚡ 음악 타임라인 스캐너 - 빠른 시작 (5분)

## 📥 1단계: 파일 다운로드

GitHub/다운로드 폴더에서 받은 모든 파일을 확인하세요:
- `package.json`
- `next.config.js`
- `.env`
- `requirements.txt`
- `timeline_extractor_backend.py`
- `page.jsx`, `layout.jsx`, `globals.css`
- `setup.bat` ← **이 파일이 중요합니다!**

---

## 🎯 2단계: 자동 설정 (추천)

### Windows 사용자 (가장 간단함!)

1. **모든 파일을 폴더에 다운로드**
   ```
   D:\Claude_Dev\music-timeline-scanner\
   ├── setup.bat ← 이 파일을 실행!
   ├── package.json
   ├── timeline_extractor_backend.py
   └── ... (다른 모든 파일)
   ```

2. **setup.bat 파일을 **더블클릭**하기**
   - 자동으로 폴더 구조 생성
   - Python/Node.js 의존성 설치
   - 완료! ✅

---

## 🚀 3단계: 앱 실행

### 터미널 1 - 백엔드

```powershell
cd D:\Claude_Dev\music-timeline-scanner
.\venv\Scripts\activate
python timeline_extractor_backend.py
```

### 터미널 2 - 프론트엔드

```powershell
cd D:\Claude_Dev\music-timeline-scanner
npm run dev
```

---

## ✅ 4단계: 확인

브라우저에서 **http://localhost:3100** 을 열면:

![](https://via.placeholder.com/600x400?text=앱+홈페이지)

- ✅ "타임라인 추출" 탭 보이기
- ✅ "폴더 스캔" 탭 보이기
- ✅ 드래그 앤 드롭 영역 보이기

---

## 🎵 사용 방법 (간단함!)

### 타임라인 추출 (곡 구간 감지)
1. 음악 파일 드래그 & 드롭
2. 자동으로 곡 경계 감지
3. TXT 파일 다운로드

### 폴더 스캔 (곡 길이 추출)
1. "폴더 스캔" 탭 선택
2. 음악 폴더 경로 입력: `C:\Users\YourName\Music`
3. "스캔" 클릭
4. CSV 다운로드

---

## 🆘 문제 해결

### ❌ setup.bat 실행이 안 됨
→ Windows Defender 차단일 수 있습니다. 허용하고 다시 실행

### ❌ "pip: command not found"
→ Python 설치 필요: https://www.python.org/downloads/

### ❌ "npm: command not found"
→ Node.js 설치 필요: https://nodejs.org/

### ❌ "ffmpeg: command not found"
```powershell
choco install ffmpeg
```
(Chocolatey 설치 필요: https://chocolatey.org/)

---

## 📚 더 자세한 정보

| 파일 | 내용 |
|------|------|
| `SETUP_GUIDE.md` | 수동 설정 방법 |
| `FOLDER_SCAN_GUIDE.md` | 폴더 스캔 상세 가이드 |
| `README.md` | 프로젝트 개요 |
| `UPDATE_v1.1.md` | 업데이트 내용 |

---

## ⏱️ 예상 시간

| 작업 | 시간 |
|------|------|
| setup.bat 실행 | 3-5분 |
| 앱 실행 | 1분 |
| 첫 사용 | 1분 |
| **총 예상 시간** | **5-7분** |

---

## 🎉 완료!

이제 다음을 할 수 있습니다:

✅ **음악 파일 분석** - 곡 구간 자동 감지
✅ **폴더 분석** - 모든 곡의 길이 추출  
✅ **결과 다운로드** - TXT/CSV 형식

**행운을 빕니다! 🎵**

---

## 💬 팁

- 포트를 변경하려면 `.env` 파일 수정
- 종료: `Ctrl+C` (두 터미널 모두)
- 다시 시작: 위의 3단계 반복

