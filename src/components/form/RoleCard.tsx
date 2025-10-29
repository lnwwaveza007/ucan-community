type RoleCardProps = {
  title: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
  inputId: string;
};

export default function RoleCard({ title, description, checked, onToggle, inputId }: RoleCardProps) {
  return (
    <label
      htmlFor={inputId}
      className={
        "block rounded-[var(--radius-lg)] border transition-all cursor-pointer select-none " +
        (checked
          ? "border-[var(--color-accent-orange)] bg-[color-mix(in_oklab,var(--color-accent-orange)_12%,transparent)] shadow-sm"
          : "border-[var(--color-muted-200)] hover:border-[var(--color-accent-orange)]")
      }
    >
      <input id={inputId} type="checkbox" checked={checked} onChange={onToggle} className="sr-only" />
      <div className="p-4 flex items-start gap-3">
        <span
          aria-hidden="true"
          className={
            "mt-1 inline-flex w-5 h-5 items-center justify-center rounded-md border transition-colors " +
            (checked
              ? "bg-[var(--color-accent-orange)] border-[var(--color-accent-orange)] text-white"
              : "bg-white border-[var(--color-muted-300)] text-transparent")
          }
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 10l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span>
          <div className="font-medium">{title}</div>
          <p className="text-sm text-[var(--muted-foreground)]">{description}</p>
        </span>
      </div>
    </label>
  );
}
