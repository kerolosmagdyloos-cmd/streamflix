# Streamflix 2.0: módulo "Ver ahora"

Módulo para añadir a Streamflix 1.0 (Next.js, App Router, TypeScript, Tailwind).

## Cómo añadirlo

1. Copia las carpetas `lib/`, `components/` y `app/series/` dentro de tu proyecto (si usas `src/`, dentro de `src/`).
2. Comprueba que el alias `@/` apunta a la raíz (o a `src/`) en `tsconfig.json`.
3. Edita `lib/series.ts`: sustituye los datos de ejemplo por tus series, temporadas y episodios.
4. Pon tus vídeos en `public/videos/...` o usa URLs de tu almacenamiento (S3, Cloudflare R2, Supabase Storage...).
5. Enlaza desde las tarjetas de Streamflix 1.0 a `/series/<id>`.

## Rutas

- `/series/<id>`: ficha con botón **Ver ahora** y lista de episodios.
- `/series/<id>/watch/<temporada>/<episodio>`: reproductor.

## Qué hace

- **Ver ahora** abre el episodio 1. Si ya has visto algo, el botón cambia a **Continuar T1 E2**.
- El progreso se guarda en el navegador (`localStorage`) cada 5 segundos.
- Al terminar un episodio salta al siguiente (también entre temporadas).

## Notas

- Está escrito para Next.js 15 (`params` es una promesa). En Next.js 14 funciona igual, porque `await` sobre un valor normal no da problemas.
- Usa solo vídeos propios, con licencia o de dominio público.
- Para añadir cuentas y que el progreso se sincronice entre dispositivos, habría que guardarlo en una base de datos en vez de `localStorage`.
