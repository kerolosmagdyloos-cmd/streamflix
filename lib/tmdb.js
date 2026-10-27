const BASE = "https://api.themoviedb.org/3";
const KEY = process.env.TMDB_API_KEY;

export const hasKey = Boolean(KEY);

export const img = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

async function get(path, params = {}) {
  if (!KEY) return null;
  const qs = new URLSearchParams({ language: "es-ES", ...params });
  const headers = {};
  // Token v4 (largo) -> Bearer. Clave v3 (corta) -> api_key.
  if (KEY.length > 40) headers.Authorization = `Bearer ${KEY}`;
  else qs.set("api_key", KEY);
  try {
    const res = await fetch(`${BASE}${path}?${qs}`, {
      headers,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function list(path, type, params = {}) {
  const data = await get(path, params);
  if (!data?.results) return [];
  return data.results
    .map((r) => ({ ...r, media_type: r.media_type || type }))
    .filter((r) => r.media_type === "tv" || r.media_type === "movie");
}

/* ---------- Datos de respaldo (títulos reales, sin imágenes) ---------- */
const FALLBACK_TV = [
  "El joven Sheldon",
  "Breaking Bad",
  "Stranger Things",
  "The Big Bang Theory",
  "Friends",
  "The Office",
  "Dark",
  "Peaky Blinders",
  "Better Call Saul",
  "Black Mirror",
  "The Boys",
  "Ozark",
].map((name, i) => ({ id: null, name, media_type: "tv", fb: i }));

const FALLBACK_MOVIES = [
  "Inception",
  "Interstellar",
  "El caballero oscuro",
  "Parásitos",
  "Gladiator",
  "Pulp Fiction",
  "Matrix",
  "El padrino",
].map((title, i) => ({ id: null, title, media_type: "movie", fb: i }));

const rowsOrFallback = (rows) => rows;

/* ---------- Home ---------- */
export async function getHome() {
  if (!hasKey) {
    return {
      hero: null,
      rows: [
        { title: "Series populares", items: FALLBACK_TV },
        { title: "Películas populares", items: FALLBACK_MOVIES },
      ],
    };
  }
  const [trending, tv, movies, topTv, comedy, action, crime, scifi, anim] =
    await Promise.all([
      list("/trending/all/day", "tv"),
      list("/tv/popular", "tv"),
      list("/movie/popular", "movie"),
      list("/tv/top_rated", "tv"),
      list("/discover/tv", "tv", { with_genres: "35", sort_by: "popularity.desc" }),
      list("/discover/movie", "movie", { with_genres: "28", sort_by: "popularity.desc" }),
      list("/discover/tv", "tv", { with_genres: "80", sort_by: "popularity.desc" }),
      list("/discover/tv", "tv", { with_genres: "10765", sort_by: "popularity.desc" }),
      list("/discover/movie", "movie", { with_genres: "16", sort_by: "popularity.desc" }),
    ]);

  const hero = trending.find((t) => t.backdrop_path && t.overview) || null;

  return {
    hero,
    rows: rowsOrFallback([
      { title: "Tendencias hoy", items: trending },
      { title: "Series populares", items: tv },
      { title: "Películas populares", items: movies },
      { title: "Series mejor valoradas", items: topTv },
      { title: "Series de comedia", items: comedy },
      { title: "Películas de acción", items: action },
      { title: "Series de crimen", items: crime },
      { title: "Ciencia ficción y fantasía", items: scifi },
      { title: "Películas de animación", items: anim },
    ]).filter((r) => r.items.length),
  };
}

/* ---------- Explorar series / películas ---------- */
const GENRES = {
  tv: [
    ["Comedia", "35"],
    ["Drama", "18"],
    ["Crimen", "80"],
    ["Animación", "16"],
    ["Ciencia ficción y fantasía", "10765"],
    ["Documental", "99"],
  ],
  movie: [
    ["Acción", "28"],
    ["Comedia", "35"],
    ["Terror", "27"],
    ["Ciencia ficción", "878"],
    ["Animación", "16"],
    ["Drama", "18"],
  ],
};

export async function getBrowse(type) {
  const label = type === "tv" ? "Series" : "Películas";
  if (!hasKey) {
    return {
      hero: null,
      rows: [
        {
          title: `${label} populares`,
          items: type === "tv" ? FALLBACK_TV : FALLBACK_MOVIES,
        },
      ],
    };
  }
  const [popular, top, ...byGenre] = await Promise.all([
    list(`/${type}/popular`, type),
    list(`/${type}/top_rated`, type),
    ...GENRES[type].map(([, id]) =>
      list(`/discover/${type}`, type, { with_genres: id, sort_by: "popularity.desc" })
    ),
  ]);
  const hero = popular.find((t) => t.backdrop_path && t.overview) || null;
  return {
    hero,
    rows: [
      { title: `${label} populares`, items: popular },
      { title: `${label} mejor valoradas`, items: top },
      ...GENRES[type].map(([name], i) => ({ title: name, items: byGenre[i] })),
    ].filter((r) => r.items.length),
  };
}

/* ---------- Búsqueda ---------- */
export async function searchTitles(query) {
  if (!query?.trim()) return [];
  if (!hasKey) {
    const q = query.toLowerCase();
    return [...FALLBACK_TV, ...FALLBACK_MOVIES].filter((i) =>
      (i.title || i.name).toLowerCase().includes(q)
    );
  }
  const data = await get("/search/multi", { query, include_adult: "false" });
  return (data?.results || []).filter(
    (r) => r.media_type === "tv" || r.media_type === "movie"
  );
}

/* ---------- Detalle ---------- */
export async function getDetails(type, id) {
  const d = await get(`/${type}/${id}`, {
    append_to_response: "videos,credits,similar",
    include_video_language: "es,en,null",
  });
  if (!d) return null;

  const vids = (d.videos?.results || []).filter((v) => v.site === "YouTube");
  const trailer =
    vids.find((v) => v.type === "Trailer" && v.official) ||
    vids.find((v) => v.type === "Trailer") ||
    vids.find((v) => v.type === "Teaser") ||
    vids[0] ||
    null;

  return {
    ...d,
    media_type: type,
    trailerKey: trailer?.key || null,
    cast: (d.credits?.cast || []).slice(0, 12),
    similar: (d.similar?.results || [])
      .map((r) => ({ ...r, media_type: type }))
      .filter((r) => r.poster_path),
  };
}

/* ---------- Temporadas y episodios ---------- */
export async function getSeason(id, seasonNumber) {
  const d = await get(`/tv/${id}/season/${seasonNumber}`);
  if (!d) return null;
  return { ...d, episodes: d.episodes || [] };
}

/* ---------- Dónde ver (datos de JustWatch vía TMDB) ---------- */
export async function getProviders(type, id, region = "ES") {
  const d = await get(`/${type}/${id}/watch/providers`);
  const r = d?.results?.[region];
  if (!r) return null;
  const clean = (arr) => (arr || []).filter((p) => p.logo_path);
  const out = {
    link: r.link,
    flatrate: clean(r.flatrate),
    rent: clean(r.rent),
    buy: clean(r.buy),
  };
  return out.flatrate.length || out.rent.length || out.buy.length ? out : null;
}
