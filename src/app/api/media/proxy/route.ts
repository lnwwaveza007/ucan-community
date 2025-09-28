import { NextRequest } from "next/server";
import { getBucket, getS3Client } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "node:stream";

function extractKeyFromUrl(u: URL): string | null {
  const publicBase = process.env.S3_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (publicBase) {
    try {
      const b = new URL(publicBase);
      if (b.hostname === u.hostname && (b.port || "") === (u.port || "") && b.protocol === u.protocol) {
        const basePath = b.pathname.replace(/\/$/, "");
        const path = u.pathname;
        const rel = path.startsWith(basePath) ? path.slice(basePath.length) : null;
        if (rel && rel.startsWith("/")) return rel.slice(1);
      }
    } catch {}
  }

  const endpoint = process.env.S3_ENDPOINT?.replace(/\/$/, "");
  const bucket = getBucket();
  if (endpoint) {
    try {
      const e = new URL(endpoint);
      if (e.hostname === u.hostname && (e.port || "") === (u.port || "") && e.protocol === u.protocol) {
        const prefix = `${e.pathname.replace(/\/$/, "")}/${bucket}/`;
        const path = u.pathname.startsWith("/") ? u.pathname : `/${u.pathname}`;
        if (path.startsWith(prefix)) {
          return path.slice(prefix.length);
        }
      }
    } catch {}
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uParam = searchParams.get("u");
    if (!uParam) return new Response("Missing u", { status: 400 });
    const target = new URL(uParam);
    const key = extractKeyFromUrl(target);
    if (!key) return new Response("Invalid URL", { status: 400 });

    const client = getS3Client();
    const bucket = getBucket();
    const obj = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    const body = obj.Body as unknown;
    let stream: ReadableStream | undefined;
    try {
      if (isTransformToWebStream(body)) {
        stream = body.transformToWebStream();
      } else if (isNodeReadable(body) && typeof (Readable as unknown as { toWeb?: (r: NodeJS.ReadableStream) => ReadableStream }).toWeb === "function") {
        const toWeb = (Readable as unknown as { toWeb: (r: NodeJS.ReadableStream) => ReadableStream }).toWeb;
        stream = toWeb(body);
      }
    } catch {
      stream = undefined;
    }
    const contentType = obj.ContentType || "application/octet-stream";
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    };
    if (!stream) {
      if (isNodeReadable(body)) {
        const uint8 = await streamToUint8Array(body);
        const ab = uint8.buffer.slice(uint8.byteOffset, uint8.byteOffset + uint8.byteLength);
        return new Response(new Blob([ab as ArrayBuffer]), { status: 200, headers });
      }
      return new Response(null, { status: 200, headers });
    }
    return new Response(stream, { status: 200, headers });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return new Response(msg, { status: 500 });
  }
}

function isTransformToWebStream(x: unknown): x is { transformToWebStream: () => ReadableStream } {
  return typeof (x as { transformToWebStream?: unknown })?.transformToWebStream === "function";
}

function isNodeReadable(x: unknown): x is NodeJS.ReadableStream {
  return x != null && typeof (x as { pipe?: unknown }).pipe === "function";
}

function streamToUint8Array(stream: NodeJS.ReadableStream): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk: unknown) => {
      if (chunk instanceof Uint8Array) {
        chunks.push(chunk);
      } else if (Buffer.isBuffer(chunk)) {
        chunks.push(new Uint8Array(chunk));
      } else if (typeof chunk === "string") {
        chunks.push(new TextEncoder().encode(chunk));
      }
    });
    stream.once("end", () => {
      const totalLen = chunks.reduce((n, c) => n + c.length, 0);
      const merged = new Uint8Array(totalLen);
      let offset = 0;
      for (const c of chunks) {
        merged.set(c, offset);
        offset += c.length;
      }
      resolve(merged);
    });
    stream.once("error", reject);
  });
}


