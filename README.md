# StreamFlix

Clon de interfaz estilo Netflix hecho con **Next.js 14 (App Router)** y **Tailwind CSS**.
Las series y películas son **reales**: se cargan desde la API de [TMDB](https://www.themoviedb.org/)
(títulos, pósters, sinopsis, reparto y tráilers de YouTube).

## Funciones

- Home con hero destacado y filas por categoría (tendencias, populares, mejor valoradas, géneros…)
- Secciones **Series** y **Películas**
- **Buscador** (series y películas)
- Página de detalle: sinopsis, géneros, temporadas/duración, reparto y títulos similares
- **Tráiler** en ventana modal (YouTube)
- **Temporadas y episodios** (series): selector de temporada con título, sinopsis, duración y miniatura de cada episodio
- **Dónde ver (España)**: plataformas legales donde está disponible (suscripción, alquiler, compra), datos de JustWatch vía TMDB
- **Episodios vistos** y **Continuar viendo** en la portada (se guarda en tu navegador)
- **Reproductor propio** para vídeos tuyos o con licencia (ver más abajo)
- Diseño responsive

## Puesta en marcha

1. Consigue una clave gratis en https://www.themoviedb.org/settings/api
   (vale la *API Key v3* o el *Token de acceso de lectura v4*).
2. Instala y configura:

```bash
npm install
cp .env.example .env.local   # y pega tu clave en TMDB_API_KEY
npm run dev
```

3. Abre http://localhost:3000

Sin clave, la app arranca igualmente con una lista de títulos de ejemplo (sin imágenes)
y un aviso para configurarla.

## Estructura

```
app/
  page.js                  Home
  explorar/[type]/page.js  Series (tv) y Películas (movie)
  search/page.js           Resultados de búsqueda
  title/[type]/[id]/page.js  Detalle + tráiler
components/                Navbar, Hero, Row, Card, TrailerButton, SetupNotice
lib/tmdb.js                Cliente de la API de TMDB
```

## Nota

Este proyecto usa la API de TMDB pero no está avalado ni certificado por TMDB.
No incluye reproducción de contenido de las plataformas: los tráilers son los
vídeos oficiales públicos de YouTube.


## Reproducir tus propios vídeos

La app no incluye vídeo de series comerciales (tienen derechos): para eso usa el botón
«Dónde ver». Si tienes vídeos propios o con licencia, copia los `.mp4` a `public/videos/`
usando el **ID de TMDB** del título (aparece en la URL de la página de detalle):

```
public/videos/<id>/s<temporada>e<episodio>.mp4   # series, p. ej. public/videos/1234/s1e2.mp4
public/videos/<id>/movie.mp4                     # películas
```

Al reiniciar, ese episodio muestra el botón «▶ Reproducir» y se marca como visto.
