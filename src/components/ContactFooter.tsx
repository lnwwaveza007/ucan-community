import Image from "next/image"
import logo from "@/images/icon-no-bg.png"

export default function ContactFooter() {
  return (
    <footer id="contact" className="py-12 border-t border-[var(--color-muted-300)] bg-[var(--muted-100)] dark:bg-[color-mix(in_srgb,var(--color-card-dark)_84%,transparent)]">
      <div className="container-page px-4 flex flex-row items-center gap-4 text-center justify-between">
        <Image src={logo} alt="Logo" width={200} height={200} />
        <div className="flex gap-3">
          {[{ name: 'FB', 'link': 'https://www.facebook.com/profile.php?id=100090000707117' },
          { name: 'IG', 'link': 'https://www.instagram.com/lifeat.ucan/?hl=en' }, 
          { name: 'LinkedIn', 'link': 'https://www.linkedin.com/in/ucan-community-14115b386/' }].map((s) => (
            <a key={s.name} href={s.link} className="h-9 w-9 grid place-items-center rounded-[10px] border border-[var(--color-muted-300)] bg-white/70 dark:bg-white/10 hover:bg-white text-[var(--brand-blue-800)] dark:text-white">
              {s.name}
            </a>
          ))}
        </div>
      </div>
      <div className="w-full text-xs text-[var(--color-muted-700)] text-center">© {new Date().getFullYear()} UCAN Community</div>
    </footer>
  );
}


