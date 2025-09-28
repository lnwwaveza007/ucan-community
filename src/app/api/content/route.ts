import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { readContent, writeContent, type SiteContent } from "@/lib/content";

export async function GET() {
  const data = await readContent();
  return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function PUT(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
  try {
    const body = (await req.json()) as SiteContent;
    await writeContent(body);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid payload";
    return new Response(JSON.stringify({ error: message }), { status: 400, headers: { "Content-Type": "application/json" } });
  }
}


