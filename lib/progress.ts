export type Progress = { season: number; episode: number; time: number };

const key = (seriesId: string) => `streamflix:progress:${seriesId}`;

export function getProgress(seriesId: string): Progress | null {
  try {
    const raw = localStorage.getItem(key(seriesId));
    return raw ? (JSON.parse(raw) as Progress) : null;
  } catch {
    return null;
  }
}

export function saveProgress(seriesId: string, progress: Progress) {
  try {
    localStorage.setItem(key(seriesId), JSON.stringify(progress));
  } catch {
    // almacenamiento no disponible: se ignora
  }
}
