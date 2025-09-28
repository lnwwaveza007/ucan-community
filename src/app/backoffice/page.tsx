import { getAdminSession } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import Editor from "./Editor";

export default async function BackofficePage() {
  const session = await getAdminSession();
  if (!session) {
    return (
      <main style={{ padding: 24 }}>
        <p>You are not authorized. Please <Link href="/login">login</Link>.</p>
      </main>
    );
  }
  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Backoffice</h1>
        <LogoutButton />
      </div>
      <p style={{ color: "#555", marginTop: 8 }}>Welcome {session?.username ?? "Admin"}.</p>

      <div style={{ marginTop: 24 }}>
        <Editor />
      </div>
    </main>
  );
}


