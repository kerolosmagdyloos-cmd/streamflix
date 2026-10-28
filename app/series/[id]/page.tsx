import Link from "next/link";
import { notFound } from "next/navigation";
import WatchButton from "@/components/WatchButton";
import { getSeries } from "@/lib/series";

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const series = getSeries(id);
  if (!series) notFound();

  const first = series.seasons[0]?.episodes[0];

  return (
    <main className="mx-auto max-w-4xl p-6 text-white">
      <h1 className="text-3xl font-bold">{series.title}</h1>
      <p className="mt-2 text-white/70">{series.description}</p>

      {first && (
        <div className="mt-6">
          <WatchButton
            seriesId={series.id}
            firstSeason={series.seasons[0].number}
            firstEpisode={first.number}
          />
        </div>
      )}

      {series.seasons.map((season) => (
        <section key={season.number} className="mt-10">
          <h2 className="text-xl font-semibold">Temporada {season.number}</h2>
          <ul className="mt-3 divide-y divide-white/10">
            {season.episodes.map((ep) => (
              <li key={ep.number}>
                <Link
                  href={`/series/${series.id}/watch/${season.number}/${ep.number}`}
                  className="flex items-center justify-between py-3 hover:text-white/70"
                >
                  <span>
                    {ep.number}. {ep.title}
                  </span>
                  <span className="text-sm text-white/50">{ep.duration}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
