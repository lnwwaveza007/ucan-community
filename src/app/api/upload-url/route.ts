import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getBucket, getPublicBaseUrl, getS3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  const { key, contentType } = await req.json().catch(() => ({}));
  if (!key || !contentType) {
    return new Response(JSON.stringify({ error: "Missing key or contentType" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }

  const client = getS3Client();
  const bucket = getBucket();
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType, ACL: "public-read" });
  const url = await getSignedUrl(client, command, { expiresIn: 60 * 5 });
  const base = getPublicBaseUrl();
  const publicUrl = `${base}/${encodeURIComponent(key).replace(/%2F/g, '/')}`;
  // If the signed URL is http (mixed content risk), provide our HTTPS proxy route for upload instead
  // Browsers block http uploads from https origins
  let safeUploadUrl = url;
  try {
    const u = new URL(url);
    if (u.protocol === "http:") {
      // Use our secure server-side proxy upload path
      safeUploadUrl = `/api/media?key=${encodeURIComponent(key)}`;
    }
  } catch {}
  return new Response(JSON.stringify({ uploadUrl: safeUploadUrl, publicUrl }), { status: 200, headers: { "Content-Type": "application/json" } });
}


