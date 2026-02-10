import type { NextConfig } from 'next';
import dotenv from 'dotenv';
import path from 'path';

const appEnv = process.env.APP_ENV ?? 'local';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${appEnv}`),
  override: true,
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  env: {
    NEXT_PUBLIC_APP_ENV: appEnv,
  },
};

export default nextConfig;
