import { NextRequest } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST(_req: NextRequest) {
  await clearAdminSession();
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}


