export default function Blog() {
  return (
    <section id="blog" className="py-16 md:py-20 bg-[var(--muted-100)] dark:bg-[color-mix(in_srgb,var(--color-card-dark)_84%,transparent)]">
      <div className="container-page px-4">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Latest Articles</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {[1,2,3,4].map((i) => (
            <a key={i} href="#" className="rounded-[var(--radius-lg)] border border-[var(--color-muted-300)] p-5 hover:bg-white/60 dark:hover:bg-white/5">
              <div className="text-sm text-[var(--color-muted-700)]">2025-09-{10+i}</div>
              <div className="font-semibold mt-1">How to Run a Great Hackathon {i}</div>
              <div className="text-sm text-[var(--color-muted-700)] mt-1">Tips for planning, execution, and showcasing projects.</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}


