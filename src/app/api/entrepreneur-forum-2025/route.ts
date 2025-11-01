export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    type Payload = Record<string, unknown>;
    let payload: Payload = {};
    if (contentType.includes("application/json")) {
      payload = (await request.json().catch(() => ({}))) as Payload;
    } else {
      const url = new URL(request.url);
      payload = Object.fromEntries(url.searchParams.entries());
    }

    function firstOf(obj: Payload, keys: string[]): unknown {
      for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          return obj[key];
        }
      }
      return undefined;
    }

    function asString(value: unknown): string {
      if (value === undefined || value === null) return "";
      if (Array.isArray(value)) return value.map((v) => String(v)).join(",");
      return String(value);
    }

    // Normalize payload fields
    const fullname = asString(firstOf(payload, ["fullname"]));
    const phone = asString(firstOf(payload, ["phone", "phoneNumber", "mobileNumber"]));
    const email = asString(firstOf(payload, ["email"]));
    const affiliation = asString(firstOf(payload, ["affiliation"]));

    if (!fullname || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields: fullname, email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const baseFormUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSci3MDPn7h8qNgo_s8NZ7dc0PMHWN9cyoSQqwMPassOLUznQg/viewform";
    const formUrl = baseFormUrl.replace("/viewform", "/formResponse");

    const params = new URLSearchParams();
    params.set("submit", "Submit");
    params.set("usp", "pp_url");
    
    // Map to Google Forms entry IDs based on the URL parameters
    params.set("entry.1735878350", fullname);
    params.set("entry.127130536", phone);
    params.set("entry.1903672821", email);
    params.set("entry.265281990", affiliation);

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
