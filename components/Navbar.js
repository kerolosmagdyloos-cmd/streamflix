import Link from "next/link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/explorar/tv", label: "Series" },
  { href: "/explorar/movie", label: "Películas" },
  { href: "/anime", label: "Anime" },
  { href: "/infantil", label: "Infantil" },
  { href: "/mi-lista", label: "Mi lista" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-black/90 to-transparent">
      <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:gap-x-6 sm:py-4 md:px-12">
        <Link href="/" className="text-lg font-extrabold tracking-tight text-brand sm:text-2xl">
          STREAMFLIX
        </Link>
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-200 sm:gap-5 sm:text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="transition hover:text-white">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <form action="/search" method="GET" className="ml-auto" role="search">
          <input
            type="search"
            name="q"
            placeholder="Series, películas…"
            aria-label="Buscar"
            className="w-24 rounded border border-neutral-600 bg-black/60 px-3 py-1.5 text-sm text-white placeholder-neutral-400 outline-none transition focus:w-36 focus:border-white sm:w-48 sm:focus:w-72"
          />
        </form>
      </nav>
    </header>
  );
}
