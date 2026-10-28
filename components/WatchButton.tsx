"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProgress } from "@/lib/progress";

type Props = {
  seriesId: string;
  firstSeason: number;
  firstEpisode: number;
};

// "Ver ahora" empieza en el episodio 1; si ya viste algo, pasa a "Continuar".
export default function WatchButton({ seriesId, firstSeason, firstEpisode }: Props) {
  const [target, setTarget] = useState({ season: firstSeason, episode: firstEpisode });
  const [resuming, setResuming] = useState(false);

  useEffect(() => {
    const progress = getProgress(seriesId);
    if (progress) {
      setTarget({ season: progress.season, episode: progress.episode });
      setResuming(true);
    }
  }, [seriesId]);

  return (
    <Link
      href={`/series/${seriesId}/watch/${target.season}/${target.episode}`}
      className="inline-flex items-center gap-2 rounded bg-white px-6 py-3 font-semibold text-black hover:bg-white/80"
    >
      ▶ {resuming ? `Continuar T${target.season} E${target.episode}` : "Ver ahora"}
    </Link>
  );
}
