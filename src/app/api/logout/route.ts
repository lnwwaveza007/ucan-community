import { buildClearAdminCookie } from "@/lib/auth";

export async function POST() {
  const c = buildClearAdminCookie();
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `${encodeURIComponent(c.name)}=${encodeURIComponent(c.value)}; Path=${c.options.path}; Max-Age=${c.options.maxAge}`,
    },
  });
}


