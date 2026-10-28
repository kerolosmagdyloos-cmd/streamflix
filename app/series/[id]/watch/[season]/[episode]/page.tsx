import Link from "next/link";
import { notFound } from "next/navigation";
import Player from "@/components/Player";
import { getEpisode, getNextEpisode, getSeries } from "@/lib/series";

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string; season: string; episode: string }>;
}) {
  const { id, season, episode } = await params;
  const seasonNumber = Number(season);
  const episodeNumber = Number(episode);

  const series = getSeries(id);
  if (!series) notFound();

  const ep = getEpisode(series, seasonNumber, episodeNumber);
  if (!ep) notFound();

  const next = getNextEpisode(series, seasonNumber, episodeNumber);

  return (
    <main className="mx-auto max-w-5xl p-4 text-white">
      <Link href={`/series/${series.id}`} className="text-sm text-white/60 hover:text-white">
        ← {series.title}
      </Link>

      <h1 className="mb-4 mt-2 text-xl font-semibold">
        T{seasonNumber} E{episodeNumber} · {ep.title}
      </h1>

      <Player
        seriesId={series.id}
        season={seasonNumber}
        episode={episodeNumber}
        videoUrl={ep.videoUrl}
        next={next}
      />

      {next && (
        <Link
          href={`/series/${series.id}/watch/${next.season}/${next.episode}`}
          className="mt-4 inline-block rounded bg-white/10 px-4 py-2 hover:bg-white/20"
        >
          Siguiente episodio →
        </Link>
      )}
    </main>
  );
}
