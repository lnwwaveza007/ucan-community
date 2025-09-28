import { NextRequest } from "next/server";
import { isAdminCreds, setAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const username = String(body.username || "").trim();
    const password = String(body.password || "").trim();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: "Missing credentials" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!isAdminCreds(username, password)) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await setAdminSession({ username, issuedAt: Date.now() });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


