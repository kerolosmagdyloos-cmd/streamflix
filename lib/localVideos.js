import fs from "node:fs";
import path from "node:path";

// Vídeos propios (o con licencia) colocados en /public/videos:
//   series:    public/videos/<idTMDB>/s<temporada>e<episodio>.mp4
//   películas: public/videos/<idTMDB>/movie.mp4
function find(rel) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", rel)) ? rel : null;
  } catch {
    return null;
  }
}

export const episodeVideo = (id, season, episode) =>
  find(`/videos/${id}/s${season}e${episode}.mp4`);

export const movieVideo = (id) => find(`/videos/${id}/movie.mp4`);
