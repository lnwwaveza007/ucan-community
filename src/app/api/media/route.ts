import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getBucket, getPublicBaseUrl, getS3Client } from "@/lib/s3";
import { DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function GET(req: NextRequest) {
  // Public listing is okay for now; lock down if needed
  const client = getS3Client();
  const bucket = getBucket();
  const { searchParams } = new URL(req.url);
  const prefix = searchParams.get("prefix") || undefined;

  const out = await client.send(new ListObjectsV2Command({ Bucket: bucket, Prefix: prefix }));
  const keys = (out.Contents || []).filter((o) => o.Key && !o.Key.endsWith("/")).map((o) => o.Key as string);
  const items = await Promise.all(keys.map(async (key) => {
    const url = `${getPublicBaseUrl()}/${encodeURIComponent(key).replace(/%2F/g, '/')}`;
    let previewUrl: string | undefined;
    try {
      // Signed preview URL in case bucket is private
      previewUrl = await getSignedUrl(client, new GetObjectCommand({ Bucket: bucket, Key: key }), { expiresIn: 60 * 5 });
    } catch {
      previewUrl = url;
    }
    const meta = (out.Contents || []).find((c) => c.Key === key);
    return {
      key,
      size: meta?.Size || 0,
      lastModified: meta?.LastModified ? new Date(meta.LastModified).toISOString() : undefined,
      url,
      previewUrl,
    };
  }));
  return new Response(JSON.stringify({ items }), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) {
    return new Response(JSON.stringify({ error: "Missing key" }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
  const client = getS3Client();
  const bucket = getBucket();
  await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
}


