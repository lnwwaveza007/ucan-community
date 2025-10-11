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

    function normalizeTimeTo24Hour(value: string): string | null {
      if (!value) return null;
      const trimmed = value.trim();
      if (!trimmed) return null;

      const ampmMatch = trimmed.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?\s*(AM|PM)$/i);
      if (ampmMatch) {
        let hours = parseInt(ampmMatch[1], 10);
        const minutes = ampmMatch[2];
        const period = ampmMatch[4].toUpperCase();
      if (hours === 12) hours = period === "AM" ? 0 : 12;
      else if (period === "PM") hours += 12;
      if (Number.isNaN(hours) || hours < 0 || hours > 23) return null;
        return `${hours.toString().padStart(2, "0")}:${minutes}`;
      }

      const twentyFourMatch = trimmed.match(/^([0-9]{1,2}):([0-9]{2})(?::([0-9]{2}))?$/);
      if (twentyFourMatch) {
        const hours = parseInt(twentyFourMatch[1], 10);
        const minutes = twentyFourMatch[2];
      if (Number.isNaN(hours) || hours < 0 || hours > 23) return null;
        return `${hours.toString().padStart(2, "0")}:${minutes}`;
      }

      return null;
    }

    function normalizeInterviewSummary(summary: string): string {
      if (!summary) return "";
      return summary
        .split(/\s*\n\s*/)
        .map((line) => {
          const trimmed = line.trim();
          if (!trimmed) return "";
          const parts = trimmed.split("+");
          if (parts.length < 2) return trimmed;
          const [datePart, timePart, ...rest] = parts;
          const [startRaw, endRaw] = (timePart ?? "").split("-");
          const normalizedStart = startRaw ? normalizeTimeTo24Hour(startRaw) ?? startRaw : "";
          const normalizedEnd = endRaw ? normalizeTimeTo24Hour(endRaw) ?? endRaw : "";
          const rebuiltTime = normalizedStart && normalizedEnd ? `${normalizedStart}-${normalizedEnd}` : timePart ?? "";
          return [datePart, rebuiltTime, ...rest].filter(Boolean).join("+");
        })
        .filter(Boolean)
        .join("\n");
    }

    // Normalize payload fields
    const fullname = asString(firstOf(payload, ["fullname"]));
    const nickname = asString(firstOf(payload, ["nickname"]));
    const faculty = asString(firstOf(payload, ["faculty"]));
    const major = asString(firstOf(payload, ["major"]));
    const phone = asString(firstOf(payload, ["phone", "phoneNumber"]));
    const email = asString(firstOf(payload, ["email"]));
    const contactOther = asString(firstOf(payload, ["contactOther", "OtherContact"]));
    const year = asString(firstOf(payload, ["year", "Year"]));
    const rawInterviewSummary = asString(firstOf(payload, ["interviewSummary", "DateForInterview"]));
    const interviewSummary = normalizeInterviewSummary(rawInterviewSummary);

    const rolesValue = firstOf(payload, ["roles"]);
    const rolesCsv = Array.isArray(rolesValue)
      ? rolesValue.map((v) => String(v)).join(",")
      : asString(rolesValue);

    const qWhy = asString(firstOf(payload, ["qWhy", "WhyInterest"]));
    const qHowHelp = asString(firstOf(payload, ["qHowHelp", "HelpTeam"]));
    const qPortfolio = asString(firstOf(payload, ["qPortfolio", "Portfolio"]));
    const qExpect = asString(firstOf(payload, ["qExpect", "WhatYouWant"]));

    if (!fullname || !email) {
      return new Response(JSON.stringify({ error: "Missing required fields: fullname, email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const baseFormUrl =
      "https://docs.google.com/forms/d/e/1FAIpQLSeQrBL5irwWvRlt45YL-rnOVuN8KkcG3iJZcJbP0yYabFwkeQ/viewform";
    const formUrl = baseFormUrl.replace("/viewform", "/formResponse");

    const params = new URLSearchParams();
    params.set("submit", "Submit");
    params.set("usp", "pp_url");
    // Map to Google Forms entry IDs per user's mapping
    params.set("entry.1126151848", fullname);
    params.set("entry.516453286", nickname);
    params.set("entry.1382129966", year);
    params.set("entry.41609756", faculty);
    params.set("entry.1737830178", major);
    params.set("entry.428879299", phone);
    params.set("entry.878658340", email);
    params.set("entry.104768491", contactOther);
    params.set("entry.1733853043", rolesCsv);
  params.set("entry.1516746499", interviewSummary);
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


