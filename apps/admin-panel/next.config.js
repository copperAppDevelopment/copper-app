/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Un `next build` escribe en el mismo `.next/` que usa `next dev`, y deja al servidor de
  // desarrollo pidiendo chunks que ya no existen (404 en main-app.js). Con
  // `NEXT_DIST_DIR=.next-verify next build` se puede verificar sin pisarlo.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  transpilePackages: ['@copper/database'],
  devIndicators: false,
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;
