import { hasKey } from "@/lib/tmdb";

export default function SetupNotice() {
  if (hasKey) return null;
  return (
    <div className="mx-4 mb-8 rounded-md border border-amber-500/50 bg-amber-950/40 p-4 text-sm text-amber-100 md:mx-12">
      <p className="font-semibold">Falta la clave de TMDB</p>
      <p className="mt-1 text-amber-200/90">
        Estás viendo solo títulos de ejemplo, sin imágenes. Crea un archivo{" "}
        <code className="rounded bg-black/40 px-1">.env.local</code> con{" "}
        <code className="rounded bg-black/40 px-1">TMDB_API_KEY=tu_clave</code>{" "}
        (gratis en themoviedb.org/settings/api) y reinicia el servidor para ver
        el catálogo real, la búsqueda y los tráilers.
      </p>
    </div>
  );
}
