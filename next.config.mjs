import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    rules: isProd ? {} : {
      "src/**/*.{tsx,jsx}": {
        loaders: [LOADER],
        as: "*.tsx",
      },
    },
  },
};

export default nextConfig;
// Orchids restart: 1760524408083
