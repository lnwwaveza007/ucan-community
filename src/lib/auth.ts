import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const ADMIN_COOKIE_NAME = "ucan_admin";

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("Missing AUTH_SECRET environment variable");
  }
  return secret;
}

export type AdminSession = {
  username: string;
  issuedAt: number;
};

function sign(payload: string): string {
  const hmac = createHmac("sha256", getSecret());
  hmac.update(payload);
  const sig = hmac.digest("hex");
  return `${payload}.${sig}`;
}

function verify(signed: string): string | null {
  const lastDot = signed.lastIndexOf(".");
  if (lastDot === -1) return null;
  const payload = signed.slice(0, lastDot);
  const signature = signed.slice(lastDot + 1);
  const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
  try {
    const a = Buffer.from(signature, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return null;
    return timingSafeEqual(a, b) ? payload : null;
  } catch {
    return null;
  }
}

export function buildAdminSessionCookie(session: AdminSession): {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    sameSite: "lax" | "strict" | "none";
    secure: boolean;
    path: string;
    maxAge: number;
  };
} {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  const signed = sign(payload);
  return {
    name: ADMIN_COOKIE_NAME,
    value: signed,
    options: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    },
  };
}

export function buildClearAdminCookie(): { name: string; value: string; options: { path: string; maxAge: number } } {
  return { name: ADMIN_COOKIE_NAME, value: "", options: { path: "/", maxAge: 0 } };
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const signed = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!signed) return null;
  const payload = verify(signed);
  if (!payload) return null;
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    const data = JSON.parse(json) as AdminSession;
    return data;
  } catch {
    return null;
  }
}

export function isAdminCreds(username: string, password: string): boolean {
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";
  return username === adminUser && password === adminPass;
}

export const constants = {
  ADMIN_COOKIE_NAME,
};


