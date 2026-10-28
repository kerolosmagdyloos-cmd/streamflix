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
export const GENRES = {
  tv: [
    ["Comedia", "35"],
    ["Drama", "18"],
    ["Crimen", "80"],
    ["Animación", "16"],
    ["Ciencia ficción y fantasía", "10765"],
    ["Acción y aventura", "10759"],
    ["Misterio", "9648"],
    ["Familia", "10751"],
    ["Documental", "99"],
  ],
  movie: [
    ["Acción", "28"],
    ["Aventura", "12"],
    ["Comedia", "35"],
    ["Terror", "27"],
    ["Ciencia ficción", "878"],
    ["Fantasía", "14"],
    ["Suspense", "53"],
    ["Romance", "10749"],
    ["Animación", "16"],
    ["Drama", "18"],
  ],
};

export const SORTS = [
  ["popular", "Más populares"],
  ["rating", "Mejor valoradas"],
  ["newest", "Más recientes"],
  ["oldest", "Más antiguas"],
];

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


/* ---------- Filtro por género y orden ---------- */
export async function getDiscover(
  type,
  { genre, sort = "popular", page = 1, anime = false } = {}
) {
  if (anime) type = "tv";
  if (!hasKey) return { items: [], totalPages: 0 };
  const today = new Date().toISOString().slice(0, 10);
  const dateField = type === "tv" ? "first_air_date" : "primary_release_date";
  const params = { page: String(Math.max(1, Number(page) || 1)) };
  const genres = [anime && "16", genre && /^\d+$/.test(genre) && genre].filter(Boolean);
  if (genres.length) params.with_genres = genres.join(","); // coma = todos a la vez
  if (anime) params.with_origin_country = "JP";

  if (sort === "rating") {
    params.sort_by = "vote_average.desc";
    params["vote_count.gte"] = "300"; // evita títulos con muy pocos votos
  } else if (sort === "newest") {
    params.sort_by = `${dateField}.desc`;
    params[`${dateField}.lte`] = today; // sin estrenos futuros
    params["vote_count.gte"] = "20";
  } else if (sort === "oldest") {
    params.sort_by = `${dateField}.asc`;
    params["vote_count.gte"] = "200";
  } else {
    params.sort_by = "popularity.desc";
  }

  const data = await get(`/discover/${type}`, params);
  if (!data?.results) return { items: [], totalPages: 0 };
  return {
    items: data.results.map((r) => ({ ...r, media_type: type })),
    totalPages: Math.min(data.total_pages || 1, 500),
  };
}


/* ---------- Anime (animación de origen japonés) ---------- */
export const ANIME_GENRES = [
  ["Acción y aventura", "10759"],
  ["Comedia", "35"],
  ["Drama", "18"],
  ["Ciencia ficción y fantasía", "10765"],
  ["Misterio", "9648"],
  ["Familia", "10751"],
];

const FALLBACK_ANIME = [
  "Attack on Titan",
  "Death Note",
  "One Piece",
  "Fullmetal Alchemist: Brotherhood",
  "Demon Slayer",
  "My Hero Academia",
  "Naruto",
  "Jujutsu Kaisen",
].map((name, i) => ({ id: null, name, media_type: "tv", fb: i }));

export async function getAnimeBrowse() {
  if (!hasKey) {
    return { hero: null, rows: [{ title: "Anime popular", items: FALLBACK_ANIME }] };
  }
  const base = { with_origin_country: "JP" };
  const defs = [
    ["Anime popular", { with_genres: "16", sort_by: "popularity.desc" }],
    [
      "Anime mejor valorado",
      { with_genres: "16", sort_by: "vote_average.desc", "vote_count.gte": "300" },
    ],
    ...ANIME_GENRES.map(([name, id]) => [
      name,
      { with_genres: `16,${id}`, sort_by: "popularity.desc" },
    ]),
  ];
  const lists = await Promise.all(
    defs.map(([, params]) => list("/discover/tv", "tv", { ...base, ...params }))
  );
  const hero = lists[0].find((t) => t.backdrop_path && t.overview) || null;
  return {
    hero,
    rows: defs
      .map(([title], i) => ({ title, items: lists[i] }))
      .filter((r) => r.items.length),
  };
}
