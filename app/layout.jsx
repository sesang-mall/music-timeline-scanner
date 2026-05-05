import React from 'react';
import './globals.css';

export const metadata = {
  title: '타임라인 추출기',
  description: '음악 파일에서 곡의 시작 시간을 자동으로 추출합니다',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
