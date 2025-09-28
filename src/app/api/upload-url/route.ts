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
  return new Response(JSON.stringify({ uploadUrl: url, publicUrl }), { status: 200, headers: { "Content-Type": "application/json" } });
}


