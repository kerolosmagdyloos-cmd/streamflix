import Card from "@/components/Card";
import SetupNotice from "@/components/SetupNotice";
import { searchTitles } from "@/lib/tmdb";

export const metadata = { title: "Buscar – StreamFlix" };

export default async function Search({ searchParams }) {
  const { q = "" } = await searchParams;
  const results = await searchTitles(q);

  return (
    <div className="px-4 pb-10 pt-28 md:px-12">
      <SetupNotice />
      <h1 className="mb-6 text-2xl font-semibold">
        {q ? (
          <>
            Resultados para <span className="text-brand">“{q}”</span>
          </>
        ) : (
          "Escribe algo en el buscador"
        )}
      </h1>

      {q && results.length === 0 && (
        <p className="text-neutral-400">
          No encontramos nada. Prueba con otro título.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {results.map((item, i) => (
          <Card key={`${item.media_type}-${item.id ?? i}`} item={item} fluid />
        ))}
      </div>
    </div>
  );
}
