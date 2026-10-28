import Link from "next/link";
import { notFound } from "next/navigation";
import EpisodeList from "@/components/EpisodeList";
import MyListButton from "@/components/MyListButton";
import Providers from "@/components/Providers";
import Row from "@/components/Row";
import TrailerButton from "@/components/TrailerButton";
import VideoPlayer from "@/components/VideoPlayer";
import { episodeVideo, movieVideo } from "@/lib/localVideos";
import { getDetails, getProviders, getSeason, img } from "@/lib/tmdb";

export async function generateMetadata({ params }) {
  const { type, id } = await params;
  if (type !== "tv" && type !== "movie") return {};
  const d = await getDetails(type, id);
  return { title: d ? `${d.title || d.name} – StreamFlix` : "StreamFlix" };
}

export default async function TitlePage({ params, searchParams }) {
  const { type, id } = await params;
  const { season: seasonParam } = await searchParams;
  if (type !== "tv" && type !== "movie") notFound();

  const [d, providers] = await Promise.all([
    getDetails(type, id),
    getProviders(type, id),
  ]);
  if (!d) notFound();

  // Temporadas y episodios (solo series)
  let seasons = [];
  let season = null;
  let episodes = [];
  if (type === "tv") {
    seasons = (d.seasons || []).filter(
      (s) => s.season_number > 0 && s.episode_count > 0
    );
    const wanted = Number(seasonParam);
    season =
      seasons.find((s) => s.season_number === wanted)?.season_number ??
      seasons[0]?.season_number ??
      null;
    if (season !== null) {
      const data = await getSeason(id, season);
      episodes = (data?.episodes || []).map((e) => ({
        id: e.id,
        episode_number: e.episode_number,
        name: e.name,
        overview: e.overview,
        air_date: e.air_date,
        runtime: e.runtime,
        still: img(e.still_path, "w300"),
        video: episodeVideo(id, season, e.episode_number),
      }));
    }
  }
  const film = type === "movie" ? movieVideo(id) : null;

  const title = d.title || d.name;
  const year = (d.release_date || d.first_air_date || "").slice(0, 4);
  const backdrop = img(d.backdrop_path, "original");
  const poster = img(d.poster_path, "w500");

  const meta = [
    type === "tv" ? "Serie" : "Película",
    year,
    type === "tv" && d.number_of_seasons
      ? `${d.number_of_seasons} temporada${d.number_of_seasons > 1 ? "s" : ""}`
      : null,
    type === "movie" && d.runtime ? `${d.runtime} min` : null,
    d.vote_average ? `★ ${d.vote_average.toFixed(1)}` : null,
  ].filter(Boolean);

  return (
    <>
      <section className="relative min-h-[70vh]">
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-surface to-transparent" />

        <div className="relative z-10 flex flex-col gap-8 px-4 pb-16 pt-32 md:flex-row md:px-12">
          {poster && (
            <img
              src={poster}
              alt={title}
              className="hidden w-60 self-start rounded-md shadow-2xl md:block"
            />
          )}
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold md:text-5xl">{title}</h1>
            {d.tagline && (
              <p className="mt-1 italic text-neutral-300">{d.tagline}</p>
            )}
            <p className="mt-3 text-sm text-neutral-300">{meta.join(" · ")}</p>

            {d.genres?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {d.genres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full border border-neutral-500 px-3 py-0.5 text-xs"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <p className="mt-5 leading-relaxed text-neutral-100">
              {d.overview || "Sin sinopsis disponible en español."}
            </p>

            <div className="mt-6 flex gap-3">
              {film && <VideoPlayer src={film} title={title} label="▶ Ver película" />}
              <TrailerButton videoKey={d.trailerKey} title={title} />
              <MyListButton
                item={{
                  id: Number(id),
                  type,
                  title,
                  poster: img(d.poster_path, "w342"),
                  year,
                }}
              />
              <Link
                href="/"
                className="rounded bg-neutral-500/60 px-6 py-2 font-semibold transition hover:bg-neutral-500/40"
              >
                Volver
              </Link>
            </div>
          </div>
        </div>
      </section>

      {type === "tv" && season !== null && (
        <section id="episodios" className="mb-10 scroll-mt-24 px-4 md:px-12">
          <h2 className="mb-3 text-lg font-semibold md:text-xl">Episodios</h2>
          <div className="mb-5 flex flex-wrap gap-2">
            {seasons.map((s) => (
              <Link
                key={s.season_number}
                href={`/title/tv/${id}?season=${s.season_number}#episodios`}
                scroll={false}
                className={`rounded-full border px-4 py-1 text-sm transition ${
                  s.season_number === season
                    ? "border-white bg-white text-black"
                    : "border-neutral-600 text-neutral-200 hover:border-white"
                }`}
              >
                Temporada {s.season_number}
              </Link>
            ))}
          </div>
          {episodes.length ? (
            <EpisodeList
              key={`${id}-${season}`}
              tvId={Number(id)}
              tvName={title}
              poster={poster}
              season={season}
              episodes={episodes}
            />
          ) : (
            <p className="text-sm text-neutral-400">
              No hay episodios disponibles para esta temporada.
            </p>
          )}
        </section>
      )}

      <Providers data={providers} />

      {d.cast.length > 0 && (
        <section className="mb-10 px-4 md:px-12">
          <h2 className="mb-3 text-lg font-semibold md:text-xl">Reparto</h2>
          <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
            {d.cast.map((c) => (
              <div key={c.id} className="w-28 shrink-0 text-center">
                {c.profile_path ? (
                  <img
                    src={img(c.profile_path, "w185")}
                    alt={c.name}
                    loading="lazy"
                    className="h-28 w-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-neutral-800 text-2xl">
                    {c.name[0]}
                  </div>
                )}
                <p className="mt-2 text-sm font-medium leading-tight">{c.name}</p>
                <p className="text-xs text-neutral-400">{c.character}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <Row title="Títulos similares" items={d.similar} />
    </>
  );
}
