//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require('@nx/next');

const isProd = process.env.NODE_ENV === 'production';

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  // productionBrowserSourceMaps: true,
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  output: 'export',
  swcMinify: true,
  // Use the prefix for GitHub Pages
  basePath: isProd ? '/fretboard-scholar' : undefined,
  assetPrefix: isProd ? '/fretboard-scholar/' : undefined,
  // Enable static export
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];

module.exports = composePlugins(...plugins)(nextConfig);
