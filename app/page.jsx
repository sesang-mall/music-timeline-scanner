'use client';

import React, { useState, useEffect } from 'react';
import { Music, Download, FolderOpen, AlertCircle, CheckCircle2, Clock, Repeat2, Sun, Moon } from 'lucide-react';

// 개발: NEXT_PUBLIC_API_URL=http://localhost:3102 (.env.local)
// 정적빌드: 빈 문자열 → 같은 서버로 요청
const API = process.env.NEXT_PUBLIC_API_URL || '';
const FPS = 30;

function fmtTime(sec) {
  const rounded = Math.round(sec);
  const h = Math.floor(rounded / 3600);
  const m = Math.floor((rounded % 3600) / 60);
  const s = rounded % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function fmtFrame(sec) {
  const totalFrames = Math.round(sec * FPS);
  const frames = totalFrames % FPS;
  const totalSecs = Math.floor(totalFrames / FPS);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(frames).padStart(2,'0')}`;
}

// ── 테마 정의 ──
const LIGHT = {
  pageBg:      'linear-gradient(135deg, #F5F1E8 0%, #EAE4D6 100%)',
  cardBg:      'rgba(255,255,255,0.85)',
  cardBorder:  'rgba(255,255,255,0.7)',
  text:        '#3D2817',
  textSub:     '#8B7355',
  textMuted:   '#9B8B77',
  accent:      '#E8A055',
  accentDim:   '#D68543',
  inputBg:     '#FDFAF5',
  inputBorder: '#D9CFC3',
  rowAlt:      'rgba(0,0,0,0.015)',
  rowBorder:   '#EDE7DD',
  groupBg:     '#F0EAE0',
  previewBg:   '#F5F1E8',
  previewText: '#7A6050',
  badgeBg:     '#F0EAE0',
  badgeText:   '#8B7355',
  errorBg:     '#FFE9E9',
  errorBorder: '#FFB3B3',
  warnBg:      '#FFF8E7',
  warnBorder:  '#FFDC7A',
  warnText:    '#7A5C00',
  spinnerA:    '#E8A055',
  spinnerB:    '#A0826D',
  btnDisabled: '#C8B99A',
  stepBg:      '#FDFAF5',
  stepBorder:  '#D9CFC3',
  toggleBg:    '#E8E0D4',
};

const DARK = {
  pageBg:      'linear-gradient(135deg, #1A1510 0%, #211C16 100%)',
  cardBg:      'rgba(40,33,25,0.95)',
  cardBorder:  'rgba(255,255,255,0.07)',
  text:        '#F0EAE0',
  textSub:     '#A08060',
  textMuted:   '#7A6A58',
  accent:      '#E8A055',
  accentDim:   '#D68543',
  inputBg:     '#251E16',
  inputBorder: '#3D3028',
  rowAlt:      'rgba(255,255,255,0.03)',
  rowBorder:   '#2E2418',
  groupBg:     '#201A12',
  previewBg:   '#1A1510',
  previewText: '#8A7060',
  badgeBg:     '#2E2418',
  badgeText:   '#A08060',
  errorBg:     '#2D1414',
  errorBorder: '#5C2020',
  warnBg:      '#2A2210',
  warnBorder:  '#5C4A10',
  warnText:    '#C8A040',
  spinnerA:    '#E8A055',
  spinnerB:    '#6B4E2A',
  btnDisabled: '#4A3C2C',
  stepBg:      '#251E16',
  stepBorder:  '#3D3028',
  toggleBg:    '#3D3028',
};

export default function TimelineExtractor() {
  const [dark, setDark] = useState(false);

  // localStorage에서 다크모드 설정 복원
  useEffect(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') setDark(true);
  }, []);

  const toggleDark = () => {
    setDark(d => {
      localStorage.setItem('darkMode', String(!d));
      return !d;
    });
  };

  const T = dark ? DARK : LIGHT;

  const [folderPath, setFolderPath] = useState('');
  const [baseSongs, setBaseSongs]   = useState([]);
  const [userTitles, setUserTitles] = useState([]);
  const [repeatCount, setRepeatCount] = useState(1);
  const [titlesText, setTitlesText] = useState('');
  const [timeline, setTimeline]     = useState([]);
  const [totalDuration, setTotalDuration] = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [warnings, setWarnings]     = useState([]);
  const [editingKey, setEditingKey] = useState(null);

  useEffect(() => {
    setUserTitles(baseSongs.map(s => s.title));
    setTitlesText('');
  }, [baseSongs]);

  useEffect(() => {
    if (!titlesText.trim() || baseSongs.length === 0) return;
    const lines = titlesText.trimEnd().split('\n').map(s => s.trim());
    if (lines.length === baseSongs.length) setUserTitles(lines);
  }, [titlesText]);

  useEffect(() => {
    if (baseSongs.length === 0) return;
    const result = [];
    let cum = 0;
    for (let r = 0; r < repeatCount; r++) {
      for (let i = 0; i < baseSongs.length; i++) {
        const song = baseSongs[i];
        result.push({
          index:            result.length + 1,
          time:             fmtTime(cum),
          timeFrame:        fmtFrame(cum),
          seconds:          cum,
          title:            userTitles[i] ?? song.title,
          filename:         song.filename,
          duration:         song.duration,
          duration_seconds: song.duration_seconds,
          repeatNum:        r + 1,
          baseIdx:          i,
        });
        cum += song.duration_seconds;
      }
    }
    setTimeline(result);
    setTotalDuration(fmtTime(cum));
  }, [baseSongs, userTitles, repeatCount]);

  const generate = async () => {
    if (!folderPath.trim()) { setError('폴더 경로를 입력하세요'); return; }
    setLoading(true);
    setError('');
    setWarnings([]);
    setBaseSongs([]);
    try {
      const res = await fetch(`${API}/api/timeline-from-folder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder_path: folderPath }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '오류 발생');
      setBaseSongs(data.timeline);
      if (data.errors?.length) setWarnings(data.errors);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTitle = (baseIdx, value) => {
    setUserTitles(prev => { const next = [...prev]; next[baseIdx] = value; return next; });
  };

  const browseFolder = async () => {
    try {
      const res = await fetch(`${API}/api/browse-folder`);
      const data = await res.json();
      if (data.success && data.path) setFolderPath(data.path);
    } catch {
      setError('폴더 선택 다이얼로그를 열 수 없습니다. 백엔드가 실행 중인지 확인하세요.');
    }
  };

  const download = async (type) => {
    try {
      const endpoint = type === 'txt' ? '/api/export' : '/api/export-csv';
      const mime     = type === 'txt' ? 'text/plain' : 'text/csv';
      const filename = type === 'txt' ? 'timeline.txt' : 'timeline.csv';
      const res = await fetch(`${API}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeline }),
      });
      const data = await res.json();
      const a = document.createElement('a');
      a.href = `data:${mime};charset=utf-8,` + encodeURIComponent(data.content);
      a.download = filename;
      a.click();
    } catch { setError('다운로드 실패'); }
  };

  const titlesLines    = titlesText.trim() ? titlesText.trimEnd().split('\n') : [];
  const titlesEntered  = titlesLines.length;
  const titlesRequired = baseSongs.length;
  const titlesMatch    = titlesRequired > 0 && titlesEntered === titlesRequired;
  const titlesMismatch = titlesRequired > 0 && titlesText.trim() && !titlesMatch;
  const hasResults     = timeline.length > 0 && !loading;

  // ── 테마 기반 스타일 헬퍼 ──
  const card       = { background: T.cardBg, borderRadius: '14px', padding: '24px 28px', border: `1px solid ${T.cardBorder}`, marginBottom: '18px' };
  const lbl        = { display: 'block', fontSize: '13px', fontWeight: '600', color: T.text, marginBottom: '8px' };
  const hint       = { fontSize: '12px', color: T.textMuted, margin: '8px 0 0 0' };
  const th         = { padding: '10px 12px', textAlign: 'left', color: T.text, fontWeight: '700', borderBottom: `2px solid ${T.accent}` };
  const td         = { padding: '9px 12px', borderBottom: `1px solid ${T.rowBorder}` };
  const inp        = { flex: 1, padding: '11px 14px', border: `1px solid ${T.inputBorder}`, borderRadius: '8px', fontSize: '14px', color: T.text, background: T.inputBg };
  const primaryBtn = (disabled) => ({
    background: disabled ? T.btnDisabled : `linear-gradient(135deg, ${T.accent}, ${T.accentDim})`,
    color: 'white', border: 'none', padding: '11px 20px', borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '14px',
    display: 'flex', alignItems: 'center', gap: '7px', whiteSpace: 'nowrap',
  });
  const outlineBtn = {
    background: 'transparent', color: T.textSub, border: `1px solid ${T.inputBorder}`,
    padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
    fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px',
  };
  const stepBtn = {
    width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${T.stepBorder}`,
    background: T.stepBg, cursor: 'pointer', fontSize: '18px', color: T.text,
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '500',
  };

  return (
    <div style={{ background: T.pageBg, minHeight: '100vh', padding: '40px 20px', fontFamily: "'Segoe UI', sans-serif", transition: 'background 0.3s' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input:focus, textarea:focus { outline: 2px solid #E8A055 !important; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.inputBorder}; border-radius: 3px; }
      `}</style>

      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ textAlign: 'center', marginBottom: '36px', position: 'relative' }}>
          {/* 다크모드 토글 */}
          <button
            onClick={toggleDark}
            title={dark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            style={{
              position: 'absolute', right: 0, top: '4px',
              background: T.toggleBg, border: 'none', borderRadius: '20px',
              padding: '7px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              color: T.textSub, fontSize: '13px', fontWeight: '600', transition: 'background 0.2s',
            }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
            {dark ? '라이트' : '다크'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '6px' }}>
            <Music size={28} color={T.textSub} />
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: T.text, margin: 0 }}>음악 타임라인 생성기</h1>
          </div>
          <p style={{ fontSize: '13px', color: T.textMuted, margin: 0 }}>폴더 내 음악 파일을 이름순으로 정렬해 타임라인 자동 생성 · 반복 재생 지원</p>
        </div>

        {/* ── Folder Input ── */}
        <div style={card}>
          <label style={lbl}>📁 음악 폴더</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={outlineBtn} onClick={browseFolder}>
              <FolderOpen size={14} /> 폴더 선택
            </button>
            <input
              style={inp}
              type="text"
              value={folderPath}
              onChange={e => setFolderPath(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && generate()}
              placeholder="폴더를 선택하거나 경로를 직접 입력하세요"
            />
            <button style={primaryBtn(loading)} onClick={generate} disabled={loading}>
              {loading ? '분석 중...' : '타임라인 생성'}
            </button>
          </div>
          <p style={hint}>MP3, WAV, FLAC, M4A, AAC, OGG, WMA · 파일명 오름차순 정렬</p>
        </div>

        {/* ── Settings ── */}
        {baseSongs.length > 0 && !loading && (
          <div style={{ ...card, display: 'grid', gridTemplateColumns: '180px 1fr', gap: '24px', alignItems: 'start' }}>
            <div>
              <label style={lbl}><Repeat2 size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />반복 횟수</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button style={stepBtn} onClick={() => setRepeatCount(n => Math.max(1, n - 1))}>−</button>
                <span style={{ fontSize: '22px', fontWeight: '700', color: T.text, minWidth: '32px', textAlign: 'center' }}>{repeatCount}</span>
                <button style={stepBtn} onClick={() => setRepeatCount(n => Math.min(99, n + 1))}>+</button>
              </div>
              <p style={{ ...hint, marginTop: '10px' }}>
                {baseSongs.length}곡 × {repeatCount}회<br />
                = <strong style={{ color: T.accent }}>{baseSongs.length * repeatCount}개</strong> 타임라인
              </p>
            </div>
            <div>
              <label style={lbl}>
                📝 곡 제목 입력
                <span style={{ fontWeight: '400', fontSize: '12px', marginLeft: '8px', color: T.textMuted }}>(선택 · {titlesRequired}줄 필요)</span>
                {titlesMatch    && <span style={{ marginLeft: '8px', color: '#27AE60', fontSize: '12px' }}>✅ {titlesEntered}줄 적용됨</span>}
                {titlesMismatch && <span style={{ marginLeft: '8px', color: '#E67E22', fontSize: '12px' }}>⚠️ {titlesEntered}/{titlesRequired}줄</span>}
              </label>
              <textarea
                style={{
                  width: '100%', height: '110px', padding: '10px 12px',
                  border: `1px solid ${titlesMismatch ? '#E67E22' : T.inputBorder}`,
                  borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit',
                  color: T.text, background: T.inputBg, resize: 'vertical',
                }}
                value={titlesText}
                onChange={e => setTitlesText(e.target.value)}
                placeholder={`곡 제목을 한 줄에 하나씩 입력하세요\n총 ${titlesRequired}줄이어야 자동 적용됩니다`}
              />
              <p style={hint}>반복 시 같은 제목이 반복됩니다 · 표에서 개별 수정도 가능</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: T.errorBg, border: `1px solid ${T.errorBorder}`, borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '10px' }}>
            <AlertCircle size={18} color="#D63031" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '14px', color: '#D63031' }}>{error}</span>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div style={{ background: T.warnBg, border: `1px solid ${T.warnBorder}`, borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: T.warnText }}>
            <strong>⚠️ 일부 파일 처리 실패 ({warnings.length}개)</strong>
            <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px' }}>{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ ...card, textAlign: 'center', padding: '44px' }}>
            <div style={{ width: '44px', height: '44px', margin: '0 auto 14px', background: `linear-gradient(135deg, ${T.spinnerA}, ${T.spinnerB})`, borderRadius: '50%', animation: 'spin 1.4s linear infinite' }} />
            <p style={{ color: T.text, fontWeight: '600', margin: 0 }}>파일 duration 분석 중...</p>
          </div>
        )}

        {/* ── Results ── */}
        {hasResults && (
          <div style={card}>
            {/* Stats + Download */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <CheckCircle2 size={18} color="#27AE60" />
                  <span style={{ fontSize: '18px', fontWeight: '700', color: T.text }}>
                    {timeline.length}개 타임라인
                    {repeatCount > 1 && <span style={{ fontSize: '13px', fontWeight: '400', color: T.textMuted, marginLeft: '8px' }}>({baseSongs.length}곡 × {repeatCount}회)</span>}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={13} color={T.textSub} />
                  <span style={{ fontSize: '13px', color: T.textSub }}>총 길이: <strong>{totalDuration}</strong></span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={outlineBtn} onClick={() => download('csv')}><Download size={13} /> CSV</button>
                <button style={primaryBtn(false)} onClick={() => download('txt')}><Download size={14} /> TXT 다운로드</button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={th}>#</th>
                    <th style={th}>시작 시간</th>
                    <th style={{ ...th, fontSize: '11px', color: T.textMuted, fontWeight: '500' }}>프레임 (30fps)</th>
                    <th style={th}>곡 제목 <span style={{ fontWeight: '400', fontSize: '11px', color: T.textMuted }}>(클릭 수정)</span></th>
                    <th style={th}>길이</th>
                    {repeatCount > 1 && <th style={th}>회차</th>}
                    <th style={{ ...th, fontSize: '11px', color: T.textMuted, fontWeight: '500' }}>파일명</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((item, idx) => {
                    const isGroupStart = repeatCount > 1 && idx > 0 && item.repeatNum !== timeline[idx - 1].repeatNum;
                    const isEditing = editingKey === `${idx}`;
                    return (
                      <React.Fragment key={idx}>
                        {isGroupStart && (
                          <tr>
                            <td colSpan={repeatCount > 1 ? 7 : 6} style={{ padding: '6px 12px', fontSize: '11px', fontWeight: '700', color: T.textSub, background: T.groupBg, letterSpacing: '0.5px' }}>
                              ── {item.repeatNum}회차 ({item.time} ~)
                            </td>
                          </tr>
                        )}
                        <tr style={{ background: idx % 2 === 0 ? T.rowAlt : 'transparent' }}>
                          <td style={{ ...td, color: T.textMuted, fontWeight: '600' }}>{item.index}</td>
                          <td style={{ ...td, fontFamily: 'monospace', fontWeight: '700', color: T.accent }}>{item.time}</td>
                          <td style={{ ...td, fontFamily: 'monospace', fontSize: '11px', color: T.textMuted }}>{item.timeFrame}</td>
                          <td style={td}>
                            {isEditing ? (
                              <input
                                type="text"
                                value={item.title}
                                onChange={e => updateTitle(item.baseIdx, e.target.value)}
                                onBlur={() => setEditingKey(null)}
                                onKeyDown={e => e.key === 'Enter' && setEditingKey(null)}
                                autoFocus
                                style={{ width: '100%', padding: '4px 8px', border: `1px solid ${T.accent}`, borderRadius: '5px', fontSize: '13px', fontFamily: 'inherit', background: T.inputBg, color: T.text }}
                              />
                            ) : (
                              <span
                                onClick={() => setEditingKey(`${idx}`)}
                                style={{ cursor: 'text', display: 'inline-block', width: '100%', padding: '3px 7px', borderRadius: '4px', color: T.text }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(232,160,85,0.12)'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                              >
                                {item.title}
                              </span>
                            )}
                          </td>
                          <td style={{ ...td, fontFamily: 'monospace', color: T.textSub }}>{item.duration}</td>
                          {repeatCount > 1 && (
                            <td style={{ ...td, textAlign: 'center' }}>
                              <span style={{ background: T.badgeBg, color: T.badgeText, borderRadius: '10px', padding: '2px 8px', fontSize: '11px', fontWeight: '600' }}>
                                {item.repeatNum}회
                              </span>
                            </td>
                          )}
                          <td style={{ ...td, fontSize: '11px', color: T.textMuted, wordBreak: 'break-all' }}>{item.filename}</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Preview */}
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '11px', color: T.textMuted, marginBottom: '6px', fontWeight: '600' }}>
                미리보기 — TXT 출력 (YouTube 호환) · CSV에는 프레임 포함
              </div>
              <div style={{ padding: '14px', background: T.previewBg, borderRadius: '8px', fontSize: '12px', color: T.previewText, maxHeight: '160px', overflowY: 'auto', fontFamily: 'monospace', lineHeight: '1.7' }}>
                {timeline.map((item, idx) => (
                  <div key={idx}>
                    <span style={{ color: T.accent }}>{item.time}</span>
                    <span style={{ color: T.textMuted, marginLeft: '6px', fontSize: '10px' }}>({item.timeFrame})</span>
                    <span style={{ marginLeft: '8px' }}>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
