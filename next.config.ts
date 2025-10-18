/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ No cortes el build por ESLint en Vercel
  eslint: {
    ignoreDuringBuilds: true,
  },
  // (Opcional) permitir imágenes remotas
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
}

module.exports = nextConfig

