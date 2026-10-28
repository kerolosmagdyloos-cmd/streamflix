import Link from "next/link";
import Card from "@/components/Card";
import FilterBar from "@/components/FilterBar";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import SetupNotice from "@/components/SetupNotice";
import { ANIME_GENRES, SORTS, getAnimeBrowse, getDiscover } from "@/lib/tmdb";

export const metadata = { title: "Anime – StreamFlix" };

export default async function Anime({ searchParams }) {
  const sp = await searchParams;
  const genre = typeof sp.genre === "string" ? sp.genre : "";
  const sort = SORTS.some(([v]) => v === sp.sort) ? sp.sort : "popular";
  const page = Math.max(1, Number(sp.page) || 1);
  const filtering = Boolean(genre) || sort !== "popular" || page > 1;

  /* ---- Modo filtrado ---- */
  if (filtering) {
    const { items, totalPages } = await getDiscover("tv", {
      genre,
      sort,
      page,
      anime: true,
    });
    const genreName = ANIME_GENRES.find(([, id]) => id === genre)?.[0];
    const sortName = SORTS.find(([v]) => v === sort)?.[1];
    const link = (p) =>
      `/anime?${new URLSearchParams({
        ...(genre && { genre }),
        sort,
        page: String(p),
      })}`;

    return (
      <div className="pb-10 pt-28">
        <div className="px-4 md:px-12">
          <SetupNotice />
          <h1 className="mb-1 text-2xl font-semibold">
            Anime{genreName ? ` · ${genreName}` : ""}
          </h1>
          <p className="mb-5 text-sm text-neutral-400">{sortName}</p>
        </div>

        <FilterBar action="/anime" genres={ANIME_GENRES} genre={genre} sort={sort} />

        {items.length === 0 ? (
          <p className="px-4 text-neutral-400 md:px-12">
            No hay resultados con estos filtros.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 md:grid-cols-4 md:px-12 lg:grid-cols-6">
            {items.map((item) => (
              <Card key={`${item.media_type}-${item.id}`} item={item} fluid />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <nav className="mt-8 flex items-center justify-center gap-4 text-sm">
            {page > 1 && (
              <Link
                href={link(page - 1)}
                className="rounded border border-neutral-600 px-4 py-1.5 hover:border-white"
              >
                ← Anterior
              </Link>
            )}
            <span className="text-neutral-400">
              Página {page} de {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={link(page + 1)}
                className="rounded border border-neutral-600 px-4 py-1.5 hover:border-white"
              >
                Siguiente →
              </Link>
            )}
          </nav>
        )}
      </div>
    );
  }

  /* ---- Modo normal ---- */
  const { hero, rows } = await getAnimeBrowse();
  return (
    <>
      <Hero item={hero} />
      <div className="-mt-16 relative z-10">
        <SetupNotice />
        <FilterBar action="/anime" genres={ANIME_GENRES} />
        {rows.map((r) => (
          <Row key={r.title} title={r.title} items={r.items} />
        ))}
      </div>
    </>
  );
}
