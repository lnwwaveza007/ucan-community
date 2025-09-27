export default function Resources() {
  return (
    <section id="resources" className="py-16 md:py-20">
      <div className="container-page px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Resources</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {[
            { t: "Startup Toolkit", d: "Notion docs, checklists, and templates to get started." },
            { t: "Workshop Materials", d: "Slides and exercises from our sessions." },
            { t: "Video Resources", d: "Talks and tutorials from mentors and alumni." },
          ].map((r) => (
            <div key={r.t} className="rounded-[var(--radius-lg)] border border-[var(--color-muted-300)] p-5">
              <div className="font-semibold">{r.t}</div>
              <div className="text-sm text-[var(--color-muted-700)] mt-1">{r.d}</div>
              <button className="mt-4 rounded-[999px] px-4 h-10 border border-[var(--color-muted-300)] hover:bg-[var(--muted-100)]">Explore</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


