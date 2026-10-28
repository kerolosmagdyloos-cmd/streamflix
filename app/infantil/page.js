import Hero from "@/components/Hero";
import Row from "@/components/Row";
import SetupNotice from "@/components/SetupNotice";
import { getKidsBrowse } from "@/lib/tmdb";

export const metadata = { title: "Infantil – StreamFlix" };

export default async function Infantil() {
  const { hero, rows } = await getKidsBrowse();
  return (
    <>
      <Hero item={hero} />
      <div className="-mt-16 relative z-10">
        <SetupNotice />
        <p className="mx-4 mb-6 rounded-md border border-sky-500/40 bg-sky-950/30 p-3 text-sm text-sky-100 md:mx-12">
          Selección de series y películas de animación y familia. Es orientativa:
          revisa siempre la clasificación por edades en la plataforma antes de
          que los peques lo vean.
        </p>
        {rows.map((r) => (
          <Row key={r.title} title={r.title} items={r.items} />
        ))}
      </div>
    </>
  );
}
