//@ts-check

const isProd = process.env.NODE_ENV === 'production';

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  // productionBrowserSourceMaps: true,
  // SVGR is disabled.
  output: 'export',
  // Use the prefix for GitHub Pages
  basePath: isProd ? '/fretboard-scholar' : undefined,
  assetPrefix: isProd ? '/fretboard-scholar/' : undefined,
  // Enable static export
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
