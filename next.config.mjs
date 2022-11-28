// Next.js bundler runs in ESM mode whereas
// Next.js web server runs in CommonJS mode
// @TODO remove package.json once Next.js web server supports ESM mode
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    NEXT_PUBLIC_GIT_COMMIT: process.env.HOPR_GIT_COMMIT
  },
}

module.exports = nextConfig
