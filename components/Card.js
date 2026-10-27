import Link from "next/link";
import { img } from "@/lib/tmdb";

const GRADIENTS = [
  "from-red-900 to-neutral-900",
  "from-indigo-900 to-neutral-900",
  "from-emerald-900 to-neutral-900",
  "from-amber-900 to-neutral-900",
  "from-fuchsia-900 to-neutral-900",
  "from-sky-900 to-neutral-900",
];

export default function Card({ item, fluid = false }) {
  const title = item.title || item.name;
  const poster = img(item.poster_path, "w342");
  const type = item.media_type || "tv";
  const year = (item.release_date || item.first_air_date || "").slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;

  const size = fluid ? "w-full" : "w-36 shrink-0 md:w-44";

  const body = (
    <div
      className={`group relative aspect-[2/3] ${size} overflow-hidden rounded-md bg-neutral-800 transition duration-300 hover:z-10 hover:scale-105 hover:shadow-2xl hover:shadow-black`}
    >
      {poster ? (
        <img
          src={poster}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
            GRADIENTS[(item.fb ?? 0) % GRADIENTS.length]
          } p-3 text-center text-sm font-semibold`}
        >
          {title}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-8 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <p className="line-clamp-2 text-xs font-semibold">{title}</p>
        <p className="mt-0.5 text-[11px] text-neutral-300">
          {[type === "tv" ? "Serie" : "Película", year, rating && `★ ${rating}`]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
    </div>
  );

  if (!item.id) return body;
  return (
    <Link href={`/title/${type}/${item.id}`} aria-label={title}>
      {body}
    </Link>
  );
}
