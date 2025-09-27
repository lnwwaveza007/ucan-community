export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      email,
      fullname,
      nickname,
      faculty,
      major,
      years,
      interests,
    } = data || {};

    if (!email || !fullname) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: email, fullname" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const formUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSeQrBL5irwWvRlt45YL-rnOVuN8KkcG3iJZcJbP0yYabFwkeQ/formResponse";

    const params = new URLSearchParams();
    // Fixed submit and usp params are generally ignored on POST, but included for parity
    params.set("submit", "Submit");
    params.set("usp", "pp_url");

    // Map to Google Forms field entry IDs
    params.set("entry.1126151848", String(email ?? ""));
    params.set("entry.516453286", String(fullname ?? ""));
    params.set("entry.41609756", String(nickname ?? ""));
    params.set("entry.1737830178", String(faculty ?? ""));
    params.set("entry.428879299", String(major ?? ""));
    params.set("entry.878658340", String(years ?? ""));
    params.set("entry.104768491", String(interests ?? ""));

    const resp = await fetch(formUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: params.toString(),
      redirect: "manual",
    });

    // Google Forms often responds with 200 and HTML, or 303 redirect. Treat 2xx/3xx as success
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
    const message =
      error instanceof Error ? error.message : "Unknown error submitting form";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


