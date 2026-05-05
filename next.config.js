/** @type {import('next').NextConfig} */
const nextConfig = {
  // STATIC_BUILD=1 일 때 정적 파일로 빌드 (out/ 폴더)
  ...(process.env.STATIC_BUILD === '1'
    ? { output: 'export', trailingSlash: false }
    : {}),
};

module.exports = nextConfig;
