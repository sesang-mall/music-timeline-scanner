# 🚀 음악 타임라인 스캐너 - 설정 가이드

## ⚠️ 오류 해결: package.json을 찾을 수 없습니다

이 문제는 프로젝트 파일들을 올바른 폴더 구조로 배치하지 않았기 때문입니다.

---

## 📁 올바른 폴더 구조

```
D:\Claude_Dev\music-timeline-scanner\
├── 📄 package.json              ← Next.js 설정
├── 📄 next.config.js            ← Next.js 환경 설정
├── 📄 .env                       ← 환경 변수 (포트 설정)
├── 📄 requirements.txt           ← Python 의존성
├── 📄 timeline_extractor_backend.py  ← FastAPI 백엔드
├── 📄 README.md                  ← 프로젝트 README
├── 📄 UPDATE_v1.1.md            ← 업데이트 정보
├── 📄 FOLDER_SCAN_GUIDE.md      ← 폴더 스캔 가이드
│
├── 📁 app/                      ← Next.js 앱 폴더 (생성하세요!)
│   ├── 📄 layout.jsx            ← 레이아웃
│   ├── 📄 page.jsx              ← 메인 페이지
│   └── 📄 globals.css           ← 글로벌 스타일
│
├── 📁 node_modules/             ← npm install 후 자동 생성
└── 📁 .next/                    ← npm run dev 후 자동 생성
```

---

## 🛠️ 단계별 설정

### 1단계: 프로젝트 폴더 생성

**Windows PowerShell/CMD에서:**
```bash
# 원하는 위치에서 실행
mkdir music-timeline-scanner
cd music-timeline-scanner
```

또는 **Windows 탐색기에서**
1. `D:\Claude_Dev\` 폴더 열기
2. 마우스 우클릭 → "새로 만들기" → "폴더"
3. `music-timeline-scanner` 이름으로 생성

### 2단계: 다운로드한 파일 복사

**다운로드한 모든 파일을 이 폴더에 복사:**

필수 파일들:
- ✅ `package.json`
- ✅ `next.config.js`
- ✅ `.env`
- ✅ `requirements.txt`
- ✅ `timeline_extractor_backend.py`
- ✅ `page.jsx`
- ✅ `layout.jsx`
- ✅ `globals.css`
- ✅ `README.md`
- ✅ `FOLDER_SCAN_GUIDE.md`
- ✅ `UPDATE_v1.1.md`

### 3단계: app 폴더 생성

`music-timeline-scanner` 폴더 안에 `app` 폴더를 생성:

```bash
mkdir app
```

그 안에 다음 파일들을 이동:
- `page.jsx` → `app/page.jsx`
- `layout.jsx` → `app/layout.jsx`
- `globals.css` → `app/globals.css`

### 4단계: 최종 구조 확인

```
D:\Claude_Dev\music-timeline-scanner\
├── package.json
├── next.config.js
├── .env
├── requirements.txt
├── timeline_extractor_backend.py
├── README.md
├── UPDATE_v1.1.md
├── FOLDER_SCAN_GUIDE.md
└── app/
    ├── page.jsx
    ├── layout.jsx
    └── globals.css
```

### 5단계: Python 의존성 설치

```bash
# PowerShell/CMD에서
cd D:\Claude_Dev\music-timeline-scanner

# Python 가상환경 생성
python -m venv venv

# 가상환경 활성화
.\venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

**설치 완료 메시지:**
```
Successfully installed fastapi uvicorn librosa numpy soundfile ...
```

### 6단계: Node.js 의존성 설치

```bash
# 같은 폴더에서 (음악-timeline-scanner)
npm install
```

**설치 완료 메시지:**
```
added XXX packages in X.XXs
```

---

## 🚀 앱 실행하기

이제 **터미널 2개**를 열어서 동시에 실행하세요:

### 터미널 1 - 백엔드 (FastAPI)

```bash
cd D:\Claude_Dev\music-timeline-scanner
.\venv\Scripts\activate
python timeline_extractor_backend.py
```

**성공 메시지:**
```
INFO:     Uvicorn running on http://0.0.0.0:3102
INFO:     Application startup complete
```

### 터미널 2 - 프론트엔드 (Next.js)

```bash
cd D:\Claude_Dev\music-timeline-scanner
npm run dev
```

**성공 메시지:**
```
▲ Next.js 14.0.0
- Local:        http://localhost:3100
```

---

## ✅ 확인

브라우저에서 다음 주소들이 열리는지 확인:

1. **프론트엔드**: http://localhost:3100
   - "타임라인 추출" / "폴더 스캔" 탭이 보입니다
   
2. **백엔드 헬스체크**: http://localhost:3102/health
   - `{"status": "ok"}` 응답이 나옵니다

---

## 🐛 자주 발생하는 문제

### ❌ "package.json을 찾을 수 없습니다"
**원인:** 폴더 구조가 잘못됨
**해결:** 위의 "올바른 폴더 구조" 섹션을 다시 확인하세요

### ❌ "pip: command not found"
**원인:** Python이 설치되지 않았거나 PATH에 없음
**해결:** 
```bash
python --version  # Python 설치 확인
python -m pip --version  # pip 확인
```

### ❌ "npm: command not found"
**원인:** Node.js가 설치되지 않았음
**해결:** https://nodejs.org/ 에서 LTS 버전 설치

### ❌ "ffmpeg: command not found"
**원인:** ffmpeg이 설치되지 않았음
**해결:**
```bash
# Windows (Chocolatey)
choco install ffmpeg

# 또는 https://ffmpeg.org/download.html 에서 수동 설치
```

### ❌ "Port 3102 already in use"
**원인:** 포트가 이미 사용 중
**해결:** 다른 앱을 닫거나 `.env` 파일에서 포트 변경

---

## 📝 파일 설명

| 파일 | 용도 |
|------|------|
| `package.json` | Node.js 프로젝트 설정 |
| `next.config.js` | Next.js 환경 설정 |
| `.env` | 포트 번호 등 환경 변수 |
| `requirements.txt` | Python 라이브러리 목록 |
| `timeline_extractor_backend.py` | FastAPI 백엔드 서버 |
| `page.jsx` | 메인 UI (React 컴포넌트) |
| `layout.jsx` | 페이지 레이아웃 |
| `globals.css` | 전역 스타일 |

---

## 💡 팁

### 포트 변경하기
`.env` 파일을 열어서:
```
BACKEND_PORT=3102    # 변경 가능
FRONTEND_PORT=3100   # 변경 가능
```

### 가상환경 매번 활성화하기
터미널 2를 열 때마다:
```bash
cd D:\Claude_Dev\music-timeline-scanner
.\venv\Scripts\activate
```

### 빠른 재시작
Ctrl+C로 앱을 종료하고 다시 실행:
```bash
python timeline_extractor_backend.py  # 또는
npm run dev
```

---

## ✨ 완료!

이제 다음을 할 수 있습니다:

✅ **타임라인 추출**: 음악 파일을 분석해서 곡 경계 감지
✅ **폴더 스캔**: 음악 폴더의 모든 곡 길이 추출
✅ **CSV 다운로드**: 결과를 Excel에서 편집

행운을 빕니다! 🎵

---

## 📞 추가 도움말

문제가 있으면:
1. 폴더 구조를 다시 확인하세요
2. `README.md`를 읽어보세요
3. `FOLDER_SCAN_GUIDE.md`를 확인하세요

