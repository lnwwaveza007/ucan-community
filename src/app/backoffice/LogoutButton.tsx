"use client";
export default function LogoutButton() {
  async function onLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }
  return (
    <button onClick={onLogout} style={{ padding: 8, border: "1px solid #ddd", borderRadius: 6 }}>
      Logout
    </button>
  );
}


