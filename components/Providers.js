import { img } from "@/lib/tmdb";

const GROUPS = [
  ["flatrate", "Incluido en suscripción"],
  ["rent", "Alquilar"],
  ["buy", "Comprar"],
];

export default function Providers({ data }) {
  return (
    <section className="mb-10 px-4 md:px-12">
      <h2 className="mb-3 text-lg font-semibold md:text-xl">
        Dónde ver (España)
      </h2>
      {!data ? (
        <p className="text-sm text-neutral-400">
          No hay información de plataformas para este título en España.
        </p>
      ) : (
        <div className="space-y-4">
          {GROUPS.map(([key, label]) =>
            data[key].length ? (
              <div key={key}>
                <p className="mb-2 text-sm text-neutral-400">{label}</p>
                <div className="flex flex-wrap gap-3">
                  {data[key].map((p) => (
                    <a
                      key={p.provider_id}
                      href={data.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${p.provider_name} – abrir`}
                      className="group flex items-center gap-2 rounded-md bg-neutral-800 p-2 pr-3 transition hover:bg-neutral-700"
                    >
                      <img
                        src={img(p.logo_path, "w92")}
                        alt=""
                        className="h-10 w-10 rounded"
                      />
                      <span className="text-sm">{p.provider_name}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null
          )}
          <p className="text-xs text-neutral-500">
            Datos de disponibilidad proporcionados por JustWatch.
          </p>
        </div>
      )}
    </section>
  );
}
