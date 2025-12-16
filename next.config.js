/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Desactivar generación estática para páginas que usan autenticación
  experimental: {
    // Esto permite que las páginas se rendericen en el servidor
  },
};

module.exports = nextConfig;
