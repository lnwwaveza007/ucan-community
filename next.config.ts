import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

function getRemotePatterns(): RemotePattern[] {
  const base = process.env.S3_PUBLIC_BASE_URL || process.env.S3_ENDPOINT;
  if (!base) return [] as RemotePattern[];
  try {
    const u = new URL(base);
    const bucket = process.env.S3_BUCKET || process.env.S3_BUCKET_NAME;
    // If using MinIO path-style at endpoint (no base url), images may be under /<bucket>/...
    const pathPrefix = (process.env.S3_PUBLIC_BASE_URL ? u.pathname : `${u.pathname.replace(/\/$/, '')}/${bucket || ''}`).replace(/\\/g,'/');
    const pathname = `${pathPrefix.replace(/\/$/,'')}/**`;
    const port = u.port || undefined;
    return [{ protocol: u.protocol.replace(':','') as 'https' | 'http', hostname: u.hostname, pathname, port }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getRemotePatterns(),
  },
};

export default nextConfig;
