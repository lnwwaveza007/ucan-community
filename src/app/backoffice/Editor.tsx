"use client";
import { useEffect, useMemo, useState } from "react";
import type { SiteContent, SlideshowItem, ProgramItem, PartnerItem } from "@/lib/content";
import MediaPicker from "./MediaPicker";
import { toDisplaySrc } from "@/lib/image";
import { IoArrowUp, IoArrowDown } from "react-icons/io5";

type Editable = SiteContent;

export default function Editor() {
  const [data, setData] = useState<Editable | null>(null);
  const [original, setOriginal] = useState<Editable | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pickerOpen, setPickerOpen] = useState<null | ((url: string) => void)>(null);

  useEffect(() => {
    fetch("/api/content").then(async (r) => {
      const json = (await r.json()) as Editable;
      setData(json);
      setOriginal(json);
    });
  }, []);

  const isDirty = useMemo(() => {
    if (!data || !original) return false;
    try {
      return JSON.stringify(data) !== JSON.stringify(original);
    } catch {
      return true;
    }
  }, [data, original]);

  async function save() {
    if (!data) return;
    setSaving(true);
    setError(null);
    setOk(false);
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Save failed");
      return;
    }
    setOk(true);
    // snapshot current as original
    setOriginal(JSON.parse(JSON.stringify(data)) as Editable);
  }

  function update<K extends keyof Editable>(key: K, value: Editable[K]) {
    setOk(false);
    setData((d) => (d ? { ...d, [key]: value } : d));
  }

  function revert() {
    if (!original) return;
    setError(null);
    setOk(false);
    setData(JSON.parse(JSON.stringify(original)) as Editable);
  }

  function moveItem<K extends keyof Editable>(key: K, index: number, direction: "up" | "down") {
    if (!data) return;
    const array = data[key] as unknown[];
    if (!Array.isArray(array)) return;
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= array.length) return;
    
    const newArray = [...array];
    [newArray[index], newArray[newIndex]] = [newArray[newIndex], newArray[index]];
    update(key, newArray as Editable[K]);
  }

  // upload handled inside MediaPicker

  if (!data) return <div>Loading...</div>;

  return (
    <div className="grid gap-6">
      <MediaPicker open={Boolean(pickerOpen)} onClose={() => setPickerOpen(null)} onSelect={(url) => pickerOpen?.(url)} />
      <section className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Hero Slideshow</h2>
          <button onClick={() => update("slideshow", [...data.slideshow, { src: "", alt: "" }])} className="px-3 py-1 border rounded">Add Slide</button>
        </div>
        <div className="mt-3 grid gap-3">
          {data.slideshow.map((s, idx) => (
            <div key={idx} className="grid md:grid-cols-4 gap-2 items-center">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem("slideshow", idx, "up")}
                    disabled={idx === 0}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <IoArrowUp className="text-sm" />
                  </button>
                  <button
                    onClick={() => moveItem("slideshow", idx, "down")}
                    disabled={idx === data.slideshow.length - 1}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <IoArrowDown className="text-sm" />
                  </button>
                </div>
                <input value={s.src} onChange={(e) => {
                  const next = [...data.slideshow];
                  next[idx] = { ...next[idx], src: e.target.value } as SlideshowItem;
                  update("slideshow", next);
                }} placeholder="/images/slide-show/test1.jpg" className="border rounded px-2 py-1 flex-1" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setPickerOpen(() => (url: string) => {
                  const next = [...data.slideshow];
                  next[idx] = { ...next[idx], src: url } as SlideshowItem;
                  update("slideshow", next);
                  setPickerOpen(null);
                })} className="px-2 py-1 border rounded">Select</button>
              </div>
              <input value={s.alt ?? ""} onChange={(e) => {
                const next = [...data.slideshow];
                next[idx] = { ...next[idx], alt: e.target.value } as SlideshowItem;
                update("slideshow", next);
              }} placeholder="Alt text" className="border rounded px-2 py-1" />
              <div className="h-20 w-32 border rounded overflow-hidden bg-white/40 grid place-items-center">
                {s.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={toDisplaySrc(s.src)} alt={s.alt ?? "preview"} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xs text-gray-500">No image</span>
                )}
              </div>
              <button onClick={() => update("slideshow", data.slideshow.filter((_, i) => i !== idx))} className="justify-self-start text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Upcoming Programs</h2>
          <button onClick={() => update("upcomingPrograms", [...data.upcomingPrograms, { title: "", date: "", description: "", image: "" }])} className="px-3 py-1 border rounded">Add Program</button>
        </div>
        <div className="mt-3 grid gap-3">
          {data.upcomingPrograms.map((p, idx) => (
            <div key={idx} className="grid md:grid-cols-6 gap-2 items-center">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem("upcomingPrograms", idx, "up")}
                    disabled={idx === 0}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <IoArrowUp className="text-sm" />
                  </button>
                  <button
                    onClick={() => moveItem("upcomingPrograms", idx, "down")}
                    disabled={idx === data.upcomingPrograms.length - 1}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <IoArrowDown className="text-sm" />
                  </button>
                </div>
                <input value={p.title} onChange={(e) => {
                  const next = [...data.upcomingPrograms];
                  next[idx] = { ...next[idx], title: e.target.value } as ProgramItem;
                  update("upcomingPrograms", next);
                }} placeholder="Title" className="border rounded px-2 py-1 flex-1" />
              </div>
              <input value={p.date} onChange={(e) => {
                const next = [...data.upcomingPrograms];
                next[idx] = { ...next[idx], date: e.target.value } as ProgramItem;
                update("upcomingPrograms", next);
              }} placeholder="Date" className="border rounded px-2 py-1" />
              <input value={p.description ?? ""} onChange={(e) => {
                const next = [...data.upcomingPrograms];
                next[idx] = { ...next[idx], description: e.target.value } as ProgramItem;
                update("upcomingPrograms", next);
              }} placeholder="Description" className="border rounded px-2 py-1" />
              <input value={p.image ?? ""} onChange={(e) => {
                const next = [...data.upcomingPrograms];
                next[idx] = { ...next[idx], image: e.target.value } as ProgramItem;
                update("upcomingPrograms", next);
              }} placeholder="/images/programs/mockup4.jpg" className="border rounded px-2 py-1" />
              <div className="flex gap-2">
                <button onClick={() => setPickerOpen(() => (url: string) => {
                  const next = [...data.upcomingPrograms];
                  next[idx] = { ...next[idx], image: url } as ProgramItem;
                  update("upcomingPrograms", next);
                  setPickerOpen(null);
                })} className="px-2 py-1 border rounded">Select</button>
              </div>
              <div className="h-20 w-32 border rounded overflow-hidden bg-white/40 grid place-items-center">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={toDisplaySrc(p.image)} alt={p.title || "preview"} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xs text-gray-500">No image</span>
                )}
              </div>
              <button onClick={() => update("upcomingPrograms", data.upcomingPrograms.filter((_, i) => i !== idx))} className="justify-self-start text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Past Programs</h2>
          <button onClick={() => update("pastPrograms", [...data.pastPrograms, { title: "", date: "", description: "", image: "" }])} className="px-3 py-1 border rounded">Add Event</button>
        </div>
        <div className="mt-3 grid gap-3">
          {data.pastPrograms.map((p, idx) => (
            <div key={idx} className="grid md:grid-cols-6 gap-2 items-center">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem("pastPrograms", idx, "up")}
                    disabled={idx === 0}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <IoArrowUp className="text-sm" />
                  </button>
                  <button
                    onClick={() => moveItem("pastPrograms", idx, "down")}
                    disabled={idx === data.pastPrograms.length - 1}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <IoArrowDown className="text-sm" />
                  </button>
                </div>
                <input value={p.title} onChange={(e) => {
                  const next = [...data.pastPrograms];
                  next[idx] = { ...next[idx], title: e.target.value } as ProgramItem;
                  update("pastPrograms", next);
                }} placeholder="Title" className="border rounded px-2 py-1 flex-1" />
              </div>
              <input value={p.date} onChange={(e) => {
                const next = [...data.pastPrograms];
                next[idx] = { ...next[idx], date: e.target.value } as ProgramItem;
                update("pastPrograms", next);
              }} placeholder="Date" className="border rounded px-2 py-1" />
              <input value={p.description ?? ""} onChange={(e) => {
                const next = [...data.pastPrograms];
                next[idx] = { ...next[idx], description: e.target.value } as ProgramItem;
                update("pastPrograms", next);
              }} placeholder="Description" className="border rounded px-2 py-1" />
              <input value={p.image ?? ""} onChange={(e) => {
                const next = [...data.pastPrograms];
                next[idx] = { ...next[idx], image: e.target.value } as ProgramItem;
                update("pastPrograms", next);
              }} placeholder="/images/programs/mockup.jpg" className="border rounded px-2 py-1" />
              <div className="flex gap-2">
                <button onClick={() => setPickerOpen(() => (url: string) => {
                  const next = [...data.pastPrograms];
                  next[idx] = { ...next[idx], image: url } as ProgramItem;
                  update("pastPrograms", next);
                  setPickerOpen(null);
                })} className="px-2 py-1 border rounded">Select</button>
              </div>
              <div className="h-20 w-32 border rounded overflow-hidden bg-white/40 grid place-items-center">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={toDisplaySrc(p.image)} alt={p.title || "preview"} className="object-cover w-full h-full" />
                ) : (
                  <span className="text-xs text-gray-500">No image</span>
                )}
              </div>
              <button onClick={() => update("pastPrograms", data.pastPrograms.filter((_, i) => i !== idx))} className="justify-self-start text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Community Partners</h2>
          <button onClick={() => update("communityPartners", [...data.communityPartners, { name: "", logo: "" }])} className="px-3 py-1 border rounded">Add Community Partner</button>
        </div>
        <div className="mt-3 grid gap-3">
          {data.communityPartners.map((p, idx) => (
            <div key={idx} className="grid md:grid-cols-4 gap-2 items-center">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem("communityPartners", idx, "up")}
                    disabled={idx === 0}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <IoArrowUp className="text-sm" />
                  </button>
                  <button
                    onClick={() => moveItem("communityPartners", idx, "down")}
                    disabled={idx === data.communityPartners.length - 1}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <IoArrowDown className="text-sm" />
                  </button>
                </div>
                <input value={p.name} onChange={(e) => {
                  const next = [...data.communityPartners];
                  next[idx] = { ...next[idx], name: e.target.value } as PartnerItem;
                  update("communityPartners", next);
                }} placeholder="Name" className="border rounded px-2 py-1 flex-1" />
              </div>
              <input value={p.logo} onChange={(e) => {
                const next = [...data.communityPartners];
                next[idx] = { ...next[idx], logo: e.target.value } as PartnerItem;
                update("communityPartners", next);
              }} placeholder="/images/partners/logo.png" className="border rounded px-2 py-1" />
              <div className="flex gap-2">
                <button onClick={() => setPickerOpen(() => (url: string) => {
                  const next = [...data.communityPartners];
                  next[idx] = { ...next[idx], logo: url } as PartnerItem;
                  update("communityPartners", next);
                  setPickerOpen(null);
                })} className="px-2 py-1 border rounded">Select</button>
              </div>
              <div className="h-20 w-32 border rounded overflow-hidden bg-white/40 grid place-items-center">
                {p.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={toDisplaySrc(p.logo)} alt={p.name || "preview"} className="object-contain w-full h-full" />
                ) : (
                  <span className="text-xs text-gray-500">No logo</span>
                )}
              </div>
              <button onClick={() => update("communityPartners", data.communityPartners.filter((_, i) => i !== idx))} className="justify-self-start text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </section>

      <section className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Corporate Partners</h2>
          <button onClick={() => update("partners", [...data.partners, { name: "", logo: "" }])} className="px-3 py-1 border rounded">Add Partner</button>
        </div>
        <div className="mt-3 grid gap-3">
          {data.partners.map((p, idx) => (
            <div key={idx} className="grid md:grid-cols-4 gap-2 items-center">
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveItem("partners", idx, "up")}
                    disabled={idx === 0}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <IoArrowUp className="text-sm" />
                  </button>
                  <button
                    onClick={() => moveItem("partners", idx, "down")}
                    disabled={idx === data.partners.length - 1}
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <IoArrowDown className="text-sm" />
                  </button>
                </div>
                <input value={p.name} onChange={(e) => {
                  const next = [...data.partners];
                  next[idx] = { ...next[idx], name: e.target.value } as PartnerItem;
                  update("partners", next);
                }} placeholder="Name" className="border rounded px-2 py-1 flex-1" />
              </div>
              <input value={p.logo} onChange={(e) => {
                const next = [...data.partners];
                next[idx] = { ...next[idx], logo: e.target.value } as PartnerItem;
                update("partners", next);
              }} placeholder="/images/partners/logo.png" className="border rounded px-2 py-1" />
              <div className="flex gap-2">
                <button onClick={() => setPickerOpen(() => (url: string) => {
                  const next = [...data.partners];
                  next[idx] = { ...next[idx], logo: url } as PartnerItem;
                  update("partners", next);
                  setPickerOpen(null);
                })} className="px-2 py-1 border rounded">Select</button>
              </div>
              <div className="h-20 w-32 border rounded overflow-hidden bg-white/40 grid place-items-center">
                {p.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={toDisplaySrc(p.logo)} alt={p.name || "preview"} className="object-contain w-full h-full" />
                ) : (
                  <span className="text-xs text-gray-500">No logo</span>
                )}
              </div>
              <button onClick={() => update("partners", data.partners.filter((_, i) => i !== idx))} className="justify-self-start text-red-600">Remove</button>
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || !isDirty}
          className={`${isDirty ? "bg-orange-600 hover:bg-orange-700" : "bg-black"} px-4 py-2 rounded-md text-white shadow-lg disabled:opacity-60`}
        >
          {saving ? "Saving..." : isDirty ? "Save changes" : "Save"}
        </button>
        <button
          onClick={revert}
          disabled={saving || !isDirty}
          className="px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-800 shadow disabled:opacity-60"
        >
          Revert
        </button>
        {ok && <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-sm shadow">Saved</span>}
        {error && <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-sm shadow">{error}</span>}
      </div>
    </div>
  );
}


