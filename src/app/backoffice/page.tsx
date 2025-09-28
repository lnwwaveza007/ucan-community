import { getAdminSession } from "@/lib/auth";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

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

      <section style={{ marginTop: 24, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Stats</h2>
          <p>Total members: 512</p>
          <p>New this week: 24</p>
        </div>
        <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Recent Signups</h2>
          <ul style={{ marginTop: 8 }}>
            <li>alice@example.com</li>
            <li>bob@example.com</li>
            <li>carol@example.com</li>
          </ul>
        </div>
        <div style={{ border: "1px solid #eee", borderRadius: 10, padding: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Actions</h2>
          <button style={{ padding: 8, background: "#111", color: "#fff", borderRadius: 6 }}>Sync Data</button>
        </div>
      </section>
    </main>
  );
}


