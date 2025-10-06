export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let payload: Record<string, unknown> = {};
    if (contentType.includes("application/json")) {
      payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    } else {
      const url = new URL(request.url);
      payload = Object.fromEntries(url.searchParams.entries());
    }

    // Normalize payload fields
    const fullname = String(payload.fullname ?? "");
    const nickname = String(payload.nickname ?? "");
    const faculty = String(payload.faculty ?? "");
    const major = String(payload.major ?? "");
    const phone = String(payload.phone ?? (payload as any).phoneNumber ?? "");
    const email = String(payload.email ?? "");
    const contactOther = String(payload.contactOther ?? (payload as any).OtherContact ?? "");

    const rolesCsv = Array.isArray((payload as any).roles)
      ? ((payload as any).roles as string[]).join(",")
      : String((payload as any).roles ?? "");

    const qWhy = String((payload as any).qWhy ?? (payload as any).WhyInterest ?? "");
    const qHowHelp = String((payload as any).qHowHelp ?? (payload as any).HelpTeam ?? "");
    const qPortfolio = String((payload as any).qPortfolio ?? (payload as any).Portfolio ?? "");
    const qExpect = String((payload as any).qExpect ?? (payload as any).WhatYouWant ?? "");

    if (!fullname || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields: fullname, email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSeQrBL5irwWvRlt45YL-rnOVuN8KkcG3iJZcJbP0yYabFwkeQ/formResponse";

    const params = new URLSearchParams();
    params.set("submit", "Submit");
    params.set("usp", "pp_url");
    // Map to Google Forms entry IDs per user's mapping
    params.set("entry.1126151848", fullname);
    params.set("entry.516453286", nickname);
    params.set("entry.41609756", faculty);
    params.set("entry.1737830178", major);
    params.set("entry.428879299", phone);
    params.set("entry.878658340", email);
    params.set("entry.104768491", contactOther);
    params.set("entry.1733853043", rolesCsv);
    params.set("entry.1254533191", qWhy);
    params.set("entry.583371985", qHowHelp);
    params.set("entry.1776809438", qPortfolio);
    params.set("entry.1816416847", qExpect);

    const resp = await fetch(formUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: params.toString(),
      redirect: "manual",
    });

    if (resp.ok || (resp.status >= 300 && resp.status < 400)) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const text = await resp.text().catch(() => "");
    return new Response(
      JSON.stringify({ success: false, status: resp.status, body: text }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


