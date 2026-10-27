"use client";

import { useEffect, useState } from "react";
import VideoPlayer from "./VideoPlayer";

const WATCHED_KEY = "sf-watched"; // { [tvId]: ["1x1", "1x2"] }
const LAST_KEY = "sf-last"; // [{ id, name, poster, season, episode, at }]

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export default function EpisodeList({ tvId, tvName, poster, season, episodes }) {
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    setWatched(read(WATCHED_KEY, {})[tvId] || []);
  }, [tvId]);

  const remember = (episode) => {
    const list = read(LAST_KEY, []).filter((x) => x.id !== tvId);
    list.unshift({ id: tvId, name: tvName, poster, season, episode, at: Date.now() });
    write(LAST_KEY, list.slice(0, 12));
  };

  const setSeen = (ep, seen) => {
    const key = `${season}x${ep}`;
    const all = read(WATCHED_KEY, {});
    const cur = new Set(all[tvId] || []);
    if (seen) cur.add(key);
    else cur.delete(key);
    all[tvId] = [...cur];
    write(WATCHED_KEY, all);
    setWatched(all[tvId]);
    if (seen) remember(ep);
  };

  const seenCount = episodes.filter((e) =>
    watched.includes(`${season}x${e.episode_number}`)
  ).length;

  return (
    <div>
      <p className="mb-4 text-sm text-neutral-400">
        {seenCount} de {episodes.length} episodios vistos
      </p>
      <ul className="divide-y divide-neutral-800">
        {episodes.map((e) => {
          const key = `${season}x${e.episode_number}`;
          const seen = watched.includes(key);
          return (
            <li
              key={e.id ?? key}
              className={`flex gap-4 py-4 ${seen ? "opacity-60" : ""}`}
            >
              <span className="w-6 shrink-0 pt-1 text-xl text-neutral-400">
                {e.episode_number}
              </span>
              <div className="hidden aspect-video w-40 shrink-0 overflow-hidden rounded bg-neutral-800 sm:block">
                {e.still && (
                  <img
                    src={e.still}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{e.name}</h3>
                  <span className="text-xs text-neutral-400">
                    {[e.air_date, e.runtime && `${e.runtime} min`]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </div>
                <p className="mt-1 line-clamp-3 text-sm text-neutral-300">
                  {e.overview || "Sin sinopsis disponible."}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {e.video && (
                    <VideoPlayer
                      src={e.video}
                      title={`${tvName} · T${season} E${e.episode_number} – ${e.name}`}
                      label="▶ Reproducir"
                      className="rounded bg-brand px-4 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
                      onPlay={() => setSeen(e.episode_number, true)}
                    />
                  )}
                  <button
                    onClick={() => setSeen(e.episode_number, !seen)}
                    className="rounded border border-neutral-600 px-3 py-1 text-xs text-neutral-200 transition hover:border-white"
                  >
                    {seen ? "✓ Visto (quitar)" : "Marcar como visto"}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
