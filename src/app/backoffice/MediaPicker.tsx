"use client";
import { useEffect, useState } from "react";

type MediaItem = { key: string; url: string; previewUrl?: string; size: number; lastModified?: string };

export default function MediaPicker({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (url: string) => void }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    fetch("/api/media?prefix=")
      .then(async (r) => r.json())
      .then((j) => setItems(j.items || []))
      .catch(() => setError("Failed to load media"))
      .finally(() => setLoading(false));
  }, [open]);

  async function handleUpload() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const key = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`;
      const r = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, contentType: file.type || "application/octet-stream" }),
      });
      if (!r.ok) {
        setError("Failed to get upload URL");
        return;
      }
      const { uploadUrl, publicUrl } = await r.json();
      const put = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type || "application/octet-stream" }, body: file });
      if (!put.ok) {
        setError("Upload failed");
        return;
      }
      setItems((prev) => [{ key, url: publicUrl, size: file.size }, ...prev]);
    };
    input.click();
  }

  async function handleDelete(key: string) {
    const ok = confirm("Delete this file?");
    if (!ok) return;
    const r = await fetch(`/api/media?key=${encodeURIComponent(key)}`, { method: "DELETE" });
    if (!r.ok) {
      setError("Delete failed");
      return;
    }
    setItems((prev) => prev.filter((i) => i.key !== key));
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-hero-gradient opacity-90" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-[960px] bg-white/90 dark:bg-[var(--color-card-dark)] backdrop-blur rounded-t-[var(--radius-lg)] md:rounded-[var(--radius-lg)] shadow-2xl ring-1 ring-black/5 max-h-[85vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-muted-300)]">
          <div className="font-semibold text-lg bg-gradient-to-r from-fuchsia-600 via-sky-600 to-emerald-600 bg-clip-text text-transparent">Media Library</div>
          <div className="flex items-center gap-2">
            <button onClick={handleUpload} className="px-3 py-1.5 rounded-[999px] bg-[var(--accent-pink)] text-white hover:bg-[var(--accent-pink-600)]">Upload</button>
            <button onClick={onClose} className="px-3 py-1.5 rounded-[999px] border">Close</button>
          </div>
        </div>
        {error && <div className="p-2 text-red-700 bg-red-100">{error}</div>}
        <div className="p-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 overflow-auto" style={{ maxHeight: "70vh" }}>
          {loading ? <div>Loading...</div> : null}
          {!loading && items.length === 0 ? <div>No files</div> : null}
          {items.map((it) => (
            <div key={it.key} className="rounded-[var(--radius-lg)] overflow-hidden group ring-1 ring-black/5 bg-white dark:bg-[var(--color-card-dark)]">
              <div className="relative w-full aspect-[4/3] bg-gray-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/media/proxy?u=${encodeURIComponent(it.previewUrl || it.url)}`} alt={it.key} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              <div className="p-2 text-xs break-all text-[var(--color-muted-700)]">{it.key}</div>
              <div className="flex items-center justify-between p-2 pt-0">
                <button onClick={() => onSelect(it.url)} className="px-2 py-1 rounded bg-emerald-600 text-white">Select</button>
                <button onClick={() => handleDelete(it.key)} className="px-2 py-1 rounded border text-red-700">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


