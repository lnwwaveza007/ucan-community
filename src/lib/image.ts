export function toDisplaySrc(src: string): string {
  if (!src) return src;
  const lower = src.toLowerCase();
  const isLocal = src.startsWith("/") || lower.startsWith("data:") || lower.startsWith("blob:");
  if (isLocal) return src;
  try {
    const u = new URL(src);
    // Proxy any http(s) remote image through our API to avoid CORS/403 and next/image host config
    if (u.protocol === "http:" || u.protocol === "https:") {
      return `/api/media/proxy?u=${encodeURIComponent(src)}`;
    }
  } catch {
    // Not a valid URL; return as-is
  }
  return src;
}


