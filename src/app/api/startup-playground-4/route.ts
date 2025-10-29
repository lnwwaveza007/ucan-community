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
    const nickname = asString(firstOf(payload, ["nickname"]));
    const faculty = asString(firstOf(payload, ["faculty", "customFaculty"]));
    const major = asString(firstOf(payload, ["major", "customMajor"]));
    const year = asString(firstOf(payload, ["year", "years"]));
    const email = asString(firstOf(payload, ["email"]));
    const phone = asString(firstOf(payload, ["phone", "phoneNumber", "mobileNumber"]));
    const lineId = asString(firstOf(payload, ["lineId"]));
    const interests = asString(firstOf(payload, ["interests", "interest"]));
    const reason = asString(firstOf(payload, ["reason", "whyYouWantToGetIn"]));
    const hasStartupExperience = asString(firstOf(payload, ["hasStartupExperience", "experienceDoingStartupBefore"]));

    if (!fullname || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields: fullname, email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const baseFormUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSfhgh1seU_zxASBf1D3aab0LEHEAzlqpcnKNXT2mDhCnL8lVQ/viewform";
    const formUrl = baseFormUrl.replace("/viewform", "/formResponse");

    const params = new URLSearchParams();
    params.set("submit", "Submit");
    params.set("usp", "pp_url");
    
    // Map to Google Forms entry IDs based on the URL parameters
    params.set("entry.929931475", fullname);
    params.set("entry.423559229", nickname);
    params.set("entry.2053674235", faculty);
    params.set("entry.1225439186", major);
    params.set("entry.1053690495", year);
    params.set("entry.1834114299", interests);
    params.set("entry.1088472306", reason);
    params.set("entry.1515053183", hasStartupExperience);
    params.set("entry.1424461072", email);
    params.set("entry.380422322", phone);
    params.set("entry.1878816742", lineId);

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
