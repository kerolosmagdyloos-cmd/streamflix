import Link from "next/link";
import { img } from "@/lib/tmdb";

export default function Hero({ item }) {
  if (!item) {
    return (
      <section className="relative flex h-[55vh] min-h-[380px] items-end bg-gradient-to-br from-red-950 via-neutral-900 to-black">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent" />
        <div className="relative z-10 max-w-2xl px-4 pb-16 md:px-12">
          <h1 className="text-4xl font-extrabold md:text-6xl">
            Series y películas, sin límites
          </h1>
          <p className="mt-3 text-neutral-300">
            Explora un catálogo real de series y películas con sinopsis, reparto
            y tráilers.
          </p>
        </div>
      </section>
    );
  }

  const title = item.title || item.name;
  const bg = img(item.backdrop_path, "original");

  return (
    <section className="relative h-[70vh] min-h-[460px] w-full">
      {bg && (
        <img
          src={bg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />
      <div className="relative z-10 flex h-full max-w-2xl flex-col justify-end gap-4 px-4 pb-24 md:px-12">
        <h1 className="text-4xl font-extrabold drop-shadow-lg md:text-6xl">
          {title}
        </h1>
        <p className="line-clamp-3 text-sm text-neutral-200 drop-shadow md:text-base">
          {item.overview}
        </p>
        <div className="flex gap-3">
          <Link
            href={`/title/${item.media_type}/${item.id}`}
            className="rounded bg-white px-6 py-2 font-semibold text-black transition hover:bg-neutral-300"
          >
            ▶ Ver tráiler
          </Link>
          <Link
            href={`/title/${item.media_type}/${item.id}`}
            className="rounded bg-neutral-500/60 px-6 py-2 font-semibold transition hover:bg-neutral-500/40"
          >
            ⓘ Más información
          </Link>
        </div>
      </div>
    </section>
  );
}
