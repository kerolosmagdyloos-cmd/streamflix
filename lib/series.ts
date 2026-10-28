export type Episode = {
  number: number;
  title: string;
  videoUrl: string; // vídeo propio o con licencia (mp4, HLS...)
  duration?: string;
};

export type Season = {
  number: number;
  episodes: Episode[];
};

export type Series = {
  id: string;
  title: string;
  description: string;
  poster: string;
  seasons: Season[];
};

// Datos de ejemplo: sustituye las URLs por tus propios vídeos
// (o contenido con licencia / dominio público).
export const SERIES: Series[] = [
  {
    id: "mi-serie",
    title: "Mi serie de ejemplo",
    description: "Serie de prueba para comprobar el botón Ver ahora.",
    poster: "/posters/mi-serie.jpg",
    seasons: [
      {
        number: 1,
        episodes: [
          { number: 1, title: "Episodio 1", videoUrl: "/videos/mi-serie/s1e1.mp4", duration: "24 min" },
          { number: 2, title: "Episodio 2", videoUrl: "/videos/mi-serie/s1e2.mp4", duration: "23 min" },
          { number: 3, title: "Episodio 3", videoUrl: "/videos/mi-serie/s1e3.mp4", duration: "25 min" },
        ],
      },
    ],
  },
];

export function getSeries(id: string) {
  return SERIES.find((s) => s.id === id);
}

export function getEpisode(series: Series, season: number, episode: number) {
  return series.seasons
    .find((s) => s.number === season)
    ?.episodes.find((e) => e.number === episode);
}

// Devuelve el episodio siguiente (pasando a la temporada siguiente si hace falta)
export function getNextEpisode(series: Series, season: number, episode: number) {
  const idx = series.seasons.findIndex((s) => s.number === season);
  if (idx === -1) return null;
  const current = series.seasons[idx];
  const next = current.episodes.find((e) => e.number === episode + 1);
  if (next) return { season: current.number, episode: next.number };
  const nextSeason = series.seasons[idx + 1];
  if (nextSeason?.episodes[0]) {
    return { season: nextSeason.number, episode: nextSeason.episodes[0].number };
  }
  return null;
}
