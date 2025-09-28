import { S3Client } from "@aws-sdk/client-s3";

export function getS3Client(): S3Client {
  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
  const accessKeyId = process.env.S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error("Missing S3 credentials. Provide S3_ACCESS_KEY/S3_SECRET_KEY or AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY.");
  }

  return new S3Client({
    region,
    endpoint: endpoint ? endpoint.replace(/\/$/, "") : undefined,
    forcePathStyle: Boolean(endpoint),
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function getBucket(): string {
  const bucket = process.env.S3_BUCKET || process.env.S3_BUCKET_NAME;
  if (!bucket) throw new Error("Missing S3 bucket. Provide S3_BUCKET or S3_BUCKET_NAME.");
  return bucket;
}

export function getPublicBaseUrl(): string {
  // Prefer explicit public base URL if provided (e.g., CloudFront or custom domain)
  const explicit = process.env.S3_PUBLIC_BASE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const bucket = getBucket();
  const endpoint = process.env.S3_ENDPOINT?.replace(/\/$/, "");
  if (endpoint) {
    // Path-style public URL for MinIO/self-host: <endpoint>/<bucket>
    return `${endpoint}/${bucket}`;
  }

  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
  // AWS virtual-hosted–style URL
  return `https://${bucket}.s3.${region}.amazonaws.com`;
}


