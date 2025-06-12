/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Temporairement désactiver certaines règles strictes
    ignoreDuringBuilds: false,
    dirs: ['pages', 'src', 'components']
  },
  // Autoriser les guillemets non échappés pour éviter les erreurs de build
  typescript: {
    ignoreBuildErrors: false
  },
  // Configuration des source maps
  productionBrowserSourceMaps: true,
  // Optimisations de build
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig; 