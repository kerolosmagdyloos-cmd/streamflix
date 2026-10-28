import { GENRES, SORTS } from "@/lib/tmdb";

// Formulario GET sin JavaScript: al aplicar, recarga con ?genre=..&sort=..
export default function FilterBar({ type, genre = "", sort = "popular" }) {
  const field =
    "rounded border border-neutral-600 bg-black/60 px-3 py-1.5 text-sm text-white outline-none focus:border-white";
  return (
    <form
      action={`/explorar/${type}`}
      method="GET"
      className="mb-6 flex flex-wrap items-end gap-3 px-4 md:px-12"
    >
      <label className="flex flex-col gap-1 text-xs text-neutral-400">
        Género
        <select name="genre" defaultValue={genre} className={field}>
          <option value="">Todos</option>
          {GENRES[type].map(([name, id]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-xs text-neutral-400">
        Ordenar por
        <select name="sort" defaultValue={sort} className={field}>
          {SORTS.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="submit"
        className="rounded bg-white px-5 py-1.5 text-sm font-semibold text-black transition hover:bg-neutral-300"
      >
        Aplicar
      </button>
    </form>
  );
}
