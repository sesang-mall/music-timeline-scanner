# 🎵 음악 타임라인 스캐너 - Claude Code 프로젝트

## 📊 현재 프로젝트 상태

### ✅ 완료된 기능
- [x] **타임라인 추출**: 음악 파일 분석 → 곡 구간 자동 감지
- [x] **폴더 스캔**: 폴더 내 모든 음악 파일의 곡 길이 추출
- [x] **TXT 다운로드**: `HH:MM:SS NN 곡제목` 형식
- [x] **CSV 다운로드**: 한글 인코딩 수정 (UTF-8 BOM)
- [x] **UI 탭 네비게이션**: 타임라인 추출 / 폴더 스캔

### ⚠️ 진행 중인 작업
- 🔧 librosa API 호환성 (filename → path)
- 🔧 audioread/PySoundFile 오류 처리

---

## 🏗️ 프로젝트 구조

```
D:\Claude_Dev\music-timeline-scanner\
├── 📁 app/
│   ├── page.jsx              # 메인 UI (React 컴포넌트)
│   ├── layout.jsx            # 페이지 레이아웃
│   └── globals.css           # 글로벌 스타일
│
├── 📁 venv/                  # Python 가상환경
├── 📁 node_modules/          # Node.js 패키지
│
├── 📄 timeline_extractor_backend.py  # FastAPI 백엔드
├── 📄 package.json           # Node.js 설정
├── 📄 next.config.js         # Next.js 설정
├── 📄 .env                   # 환경 변수
├── 📄 requirements.txt        # Python 패키지
│
└── 📄 CLAUDE.md              # 이 파일
```

---

## 🛠️ 기술 스택

| 계층 | 기술 | 버전 |
|------|------|------|
| **백엔드** | FastAPI | 0.104.1 |
| **음악 분석** | librosa | 0.10.0 |
| **파일 처리** | soundfile | 0.12.1 |
| **프론트엔드** | Next.js | 14.0.0 |
| **UI 라이브러리** | React | 18.2.0 |
| **아이콘** | lucide-react | 0.292.0 |

---

## 🚀 현재 실행 상태

### 포트 설정
- **백엔드**: 3102 (FastAPI/Uvicorn)
- **프론트엔드**: 3100 (Next.js)

### 실행 명령어

**터미널 1 - 백엔드:**
```bash
cd D:\Claude_Dev\music-timeline-scanner
.\venv\Scripts\Activate.ps1
python timeline_extractor_backend.py
```

**터미널 2 - 프론트엔드:**
```bash
cd D:\Claude_Dev\music-timeline-scanner
npm run dev
```

**브라우저:**
```
http://localhost:3100
```

---

## 📝 API 엔드포인트

### 타임라인 추출
**POST** `/api/analyze`
```json
// 요청
{
  "file": <audio file>
}

// 응답
{
  "success": true,
  "timeline": [
    {
      "index": 1,
      "time": "00:00:00",
      "seconds": 0,
      "title": "곡 1"
    }
  ],
  "detected_songs": 3
}
```

### 타임라인 내보내기
**POST** `/api/export`
```json
// 요청
{
  "timeline": [...]
}

// 응답 (TXT)
00:00:00 01 City Glow
00:03:15 02 Neon Honey
```

### 폴더 스캔
**POST** `/api/scan-folder`
```json
// 요청
{
  "folder_path": "D:/Music"
}

// 응답
{
  "success": true,
  "total_files": 100,
  "total_duration": "412:35",
  "files": [
    {
      "index": 1,
      "filename": "song1.mp3",
      "duration": "3:45",
      "size_mb": 8.5
    }
  ]
}
```

### 폴더 스캔 결과 내보내기
**POST** `/api/export-folder-scan`
```json
// 요청
{
  "files": [...]
}

// 응답 (CSV with UTF-8 BOM)
번호,파일명,곡길이,파일크기(MB)
1,song1.mp3,3:45,8.5
```

---

## 🎨 UI 컴포넌트

### 상태 관리 (React State)
```javascript
// Timeline Extractor 상태
const [file, setFile] = useState(null);
const [timeline, setTimeline] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');

// Folder Scan 상태
const [folderPath, setFolderPath] = useState('');
const [folderData, setFolderData] = useState(null);
const [folderLoading, setFolderLoading] = useState(false);
const [folderError, setFolderError] = useState('');

// 탭 네비게이션
const [activeTab, setActiveTab] = useState('timeline');
```

### 디자인 시스템

**색상:**
- 배경: `#F5F1E8` (크림색)
- 강조: `#E8A055` (따뜻한 오렌지)
- 텍스트: `#3D2817` (진한 갈색)
- 성공: `#27AE60` (초록)
- 오류: `#D63031` (빨강)

**폰트:**
- 시스템 폰트 (`Segoe UI`)
- 모노스페이스: `monospace` (시간, 파일명)

---

## 🔧 주요 함수

### 백엔드 (Python)

**`detect_song_boundaries(audio_path, sr=22050)`**
- librosa로 음악 에너지 분석
- RMS 정규화
- 무음 구간 + 에너지 변화로 경계 감지
- 최소 5초 간격 필터링

**`format_time(seconds)`**
- 초를 HH:MM:SS 형식으로 변환

**`analyze_audio(file)`**
- 음악 파일 분석 메인 함수
- 타임라인 생성
- JSON 응답

**`scan_folder(folder_path)`**
- 폴더 내 모든 음악 파일 스캔
- 지원 형식: MP3, WAV, M4A, FLAC, AAC, OGG, WMA
- 각 파일의 길이, 크기 추출

### 프론트엔드 (React)

**`handleDragOver/handleDragLeave/handleDrop`**
- 드래그 & 드롭 UI 처리

**`processFile(selectedFile)`**
- 파일 유효성 검사
- 분석 시작

**`analyzeFile(fileToAnalyze)`**
- 백엔드에 POST 요청
- 타임라인 업데이트

**`scanFolder()`**
- 폴더 스캔 API 호출
- 결과 표시

**`downloadTXT/downloadCSV`**
- 파일 다운로드 처리

---

## 🐛 알려진 이슈 & 해결 방법

### Issue 1: librosa.get_duration() 호환성
**증상:** FutureWarning: `filename` → `path` 변경
**상태:** ✅ 고정됨 (filename → path)
**파일:** `timeline_extractor_backend.py` 라인 38, 137, 213

### Issue 2: PySoundFile 실패
**증상:** audioread fallback, 일부 파일 분석 실패
**상태:** ⏳ 진행 중
**해결책:** ffmpeg 설치 확인, audioread 대안 검토

### Issue 3: CSV 한글 깨짐
**증상:** Excel에서 한글 표시 안 됨
**상태:** ✅ 고정됨 (UTF-8 BOM \ufeff 추가)
**파일:** `timeline_extractor_backend.py` `/api/export-folder-scan`

---

## 📋 다음 단계 (TODO)

### 우선순위 높음
- [ ] ffmpeg 기반 오디오 처리 대안 검토
- [ ] audioread 또는 pydub 추가
- [ ] 음악 파일 메타데이터 추출 (아티스트, 앨범 등)

### 우선순위 중간
- [ ] UI 개선 (로딩 애니메이션, 진행률 표시)
- [ ] 에러 처리 개선 (더 친절한 메시지)
- [ ] 파일 크기 제한 설정

### 우선순위 낮음
- [ ] 곡 제목 자동 감지 (Genius API, Spotify API)
- [ ] 유튜브 업로드 메타데이터 생성
- [ ] 데이터베이스 저장 (플레이리스트 관리)

---

## 🚀 Claude Code에서 시작하기

### 1. 폴더 열기
```bash
code D:\Claude_Dev\music-timeline-scanner
```

### 2. 터미널에서 앱 실행
```bash
# 터미널 1
.\venv\Scripts\Activate.ps1
python timeline_extractor_backend.py

# 터미널 2
npm run dev
```

### 3. 수정할 파일

**백엔드 수정:** `timeline_extractor_backend.py`
```python
# 주요 함수들
- detect_song_boundaries()    # 곡 경계 감지 로직
- analyze_audio()             # 음악 분석 메인
- scan_folder()              # 폴더 스캔
- export_timeline()          # TXT 내보내기
```

**프론트엔드 수정:** `app/page.jsx`
```javascript
// 주요 섹션
- Timeline Tab (라인 260-512)
- Folder Scan Tab (라인 514-700)
- 상태 관리 (라인 1-40)
- 함수들 (라인 41-200)
```

### 4. 디버깅
```bash
# 백엔드 로그 보기
# PowerShell에서 백엔드 실행, 콘솔에서 오류 메시지 확인

# 프론트엔드 로그 보기
# http://localhost:3100 → F12 (개발자 도구) → Console
```

---

## 📞 주요 설정값

| 설정 | 값 | 파일 |
|------|-----|------|
| 백엔드 포트 | 3102 | `.env` |
| 프론트엔드 포트 | 3100 | `.env` |
| librosa SR | 22050 Hz | `timeline_extractor_backend.py` |
| 곡 경계 최소 간격 | 5초 | `timeline_extractor_backend.py` |
| 무음 임계값 | 에너지의 15% | `timeline_extractor_backend.py` |

---

## 🎯 프로젝트 목표

✅ **완료:**
- 음악 파일 분석 및 곡 경계 감지
- 폴더 스캔 및 곡 길이 추출
- 사용자 친화적 UI
- 한글 인코딩 처리

⏳ **진행 중:**
- 안정성 개선 (오디오 포맷 호환성)

🔮 **향후:**
- 메타데이터 관리
- 유튜브 통합
- 데이터베이스 저장

---

## 💡 팁

1. **빠른 테스트:** 간단한 MP3 파일 (5MB 이하)로 먼저 테스트
2. **로그 확인:** 백엔드 콘솔과 브라우저 개발자 도구 모두 확인
3. **파일 경로:** Windows 경로는 `\\` 또는 `/` 모두 사용 가능
4. **포트 충돌:** 3100/3102가 이미 사용 중이면 `.env` 수정

---

**이 파일을 참고해서 Claude Code에서 계속 개발하세요!** 🚀

