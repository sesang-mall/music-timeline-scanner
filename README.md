# 🎵 타임라인 추출기 - 설치 및 실행 가이드

## 📋 시스템 요구사항
- Python 3.9+
- Node.js 18+
- ffmpeg (음악 파일 처리용)

## 🛠️ 설치

### 1. ffmpeg 설치 (Windows)
```bash
# Chocolatey 사용
choco install ffmpeg

# 또는 수동 설치
# https://ffmpeg.org/download.html에서 다운로드 후 PATH에 추가
```

### 2. 백엔드 설정
```bash
# 프로젝트 폴더로 이동
cd /path/to/timeline-extractor

# Python 가상환경 생성 (권장)
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# 의존성 설치
pip install -r requirements.txt
```

### 3. 프론트엔드 설정
```bash
# Node.js 의존성 설치
npm install

# 또는 yarn 사용
yarn install
```

## 🚀 실행

### 터미널 1: 백엔드 실행
```bash
# 가상환경 활성화 (이미 활성화됨)
python timeline_extractor_backend.py

# 또는 uvicorn 직접 실행
uvicorn timeline_extractor_backend:app --reload --port 3102
```

백엔드가 성공적으로 실행되면:
```
INFO:     Uvicorn running on http://0.0.0.0:3102
```

### 터미널 2: 프론트엔드 실행
```bash
# 다른 터미널에서 실행
npm run dev

# 또는
yarn dev
```

프론트엔드가 실행되면:
```
▲ Next.js 14.0.0
- Local:        http://localhost:3100
```

## 📱 사용 방법

1. **브라우저에서 `http://localhost:3100` 접속**

2. **음악 파일 업로드**
   - MP3, WAV, M4A 파일을 드래그 앤 드롭하거나 클릭해서 업로드
   - 여러 곡이 연달아 있는 파일도 가능

3. **자동 분석**
   - 음악 구간이 자동으로 감지됩니다
   - 각 곡의 시작 시간이 `HH:MM:SS` 형식으로 표시됩니다

4. **곡 제목 수정**
   - 테이블의 "곡 제목" 부분을 클릭하면 수정 가능
   - 기본값: "곡 1", "곡 2" 등

5. **TXT 파일 다운로드**
   - "TXT 다운로드" 버튼을 클릭
   - `00:00:00 곡 제목` 형식으로 저장됩니다

## 📊 예시 출력

```
00:00:00 Spring Breeze
00:03:45 Love Story
00:07:20 Midnight Dreams
00:11:15 Rainy Day
```

## 🔧 포트 설정

기본 설정:
- **백엔드**: `localhost:3102`
- **프론트엔드**: `localhost:3100`

포트를 변경하려면:
1. `.env` 파일 수정
2. `BACKEND_PORT=3102` → 원하는 포트로 변경
3. 백엔드 및 프론트엔드 재시작

## 🐛 문제 해결

### "분석 실패" 에러
- ffmpeg이 설치되었는지 확인: `ffmpeg -version`
- 백엔드가 실행 중인지 확인: `http://localhost:3102/health`

### CORS 오류
- 백엔드가 포트 3102에서 실행 중인지 확인
- 방화벽 설정 확인

### 음악 파일 인식 안 됨
- 파일 형식 확인 (MP3, WAV, M4A만 지원)
- 파일 손상 여부 확인
- ffmpeg 재설치

## 📝 알고리즘 설명

앱은 다음 방식으로 곡 경계를 감지합니다:

1. **RMS 에너지 분석**
   - 음악의 에너지를 주파수 분석으로 측정

2. **무음 구간 감지**
   - 에너지가 임계값 이하인 부분 감지

3. **에너지 변화 추적**
   - gradient로 급격한 변화 감지

4. **경계 결정**
   - 무음 + 에너지 변화 = 곡의 경계로 판단

최소 간격: 5초 (너무 가까운 경계 필터링)

## 🎯 팁

- **정확도 향상**: 곡 사이에 2초 이상의 무음 구간이 있으면 좋습니다
- **음악 스타일**: 가사 있는 곡이 순수 악기곡보다 감지가 더 정확합니다
- **파일 길이**: 최대 1시간 파일 권장 (분석 시간 고려)

## 📞 피드백

버그 리포트나 기능 개선 제안은 프로젝트 이슈로 남겨주세요!
