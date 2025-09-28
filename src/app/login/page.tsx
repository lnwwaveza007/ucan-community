"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error || "Login failed");
        setLoading(false);
        return;
      }
      router.replace("/backoffice");
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "60vh", alignItems: "center", justifyContent: "center" }}>
      <form onSubmit={onSubmit} style={{ width: 360, display: "grid", gap: 12 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Admin Login</h1>
        <label>
          <div style={{ fontSize: 12, marginBottom: 4 }}>Username</div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="admin"
            style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
          />
        </label>
        <label>
          <div style={{ fontSize: 12, marginBottom: 4 }}>Password</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="••••••••"
            style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
          />
        </label>
        {error ? (
          <div style={{ color: "#b91c1c", fontSize: 12 }}>{error}</div>
        ) : null}
        <button
          disabled={loading}
          type="submit"
          style={{ padding: 10, background: "black", color: "white", borderRadius: 6 }}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}


