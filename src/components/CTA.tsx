"use client";
import { useI18n } from "@/lib/i18n/context";
import { useRouter } from "next/navigation";

export default function CTA() {
  const { messages } = useI18n();
  const router = useRouter();
  return (
    <section className="py-16 md:py-20" >
      <div className="container-page px-4 ">
        <div className="rounded-[24px] p-10 bg-[radial-gradient(1200px_400px_at_0%_-10%,rgba(255,77,141,0.2),transparent_60%),radial-gradient(1200px_400px_at_100%_-10%,rgba(255,107,44,0.2),transparent_60%),linear-gradient(180deg,var(--brand-blue-700),var(--brand-blue-900))] text-white grid md:grid-cols-[1fr_auto] items-center gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">{messages.cta.heading}</h3>
            <p className="text-white/80 mt-2">{messages.cta.description}</p>
          </div>
          <button className="rounded-[999px] px-6 h-12 bg-white text-[var(--brand-blue-800)] font-semibold hover:bg-white/90" onClick={() => router.push("/register")}>{messages.cta.primary}</button>
        </div>
      </div>
    </section>
  );
}


