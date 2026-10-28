"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { getProgress, saveProgress } from "@/lib/progress";

type Props = {
  seriesId: string;
  season: number;
  episode: number;
  videoUrl: string;
  next: { season: number; episode: number } | null;
};

export default function Player({ seriesId, season, episode, videoUrl, next }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const lastSave = useRef(0);

  // Si vuelves al mismo episodio, retoma por donde lo dejaste
  useEffect(() => {
    const video = ref.current;
    const progress = getProgress(seriesId);
    if (video && progress && progress.season === season && progress.episode === episode) {
      video.currentTime = progress.time;
    }
  }, [seriesId, season, episode]);

  function onTimeUpdate() {
    const now = Date.now();
    if (now - lastSave.current < 5000) return; // guarda cada 5 s
    lastSave.current = now;
    saveProgress(seriesId, { season, episode, time: ref.current?.currentTime ?? 0 });
  }

  function onEnded() {
    if (next) {
      // Al terminar, el progreso apunta al inicio del siguiente episodio
      saveProgress(seriesId, { season: next.season, episode: next.episode, time: 0 });
      router.push(`/series/${seriesId}/watch/${next.season}/${next.episode}`);
    } else {
      saveProgress(seriesId, { season, episode, time: 0 });
    }
  }

  return (
    <video
      ref={ref}
      key={videoUrl}
      src={videoUrl}
      controls
      autoPlay
      playsInline
      onTimeUpdate={onTimeUpdate}
      onEnded={onEnded}
      className="aspect-video w-full rounded bg-black"
    />
  );
}
