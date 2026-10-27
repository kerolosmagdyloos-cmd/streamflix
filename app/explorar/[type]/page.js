import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import SetupNotice from "@/components/SetupNotice";
import { getBrowse } from "@/lib/tmdb";

export async function generateMetadata({ params }) {
  const { type } = await params;
  return { title: type === "tv" ? "Series – StreamFlix" : "Películas – StreamFlix" };
}

export default async function Browse({ params }) {
  const { type } = await params;
  if (type !== "tv" && type !== "movie") notFound();
  const { hero, rows } = await getBrowse(type);
  return (
    <>
      <Hero item={hero} />
      <div className="-mt-16 relative z-10">
        <SetupNotice />
        {rows.map((r) => (
          <Row key={r.title} title={r.title} items={r.items} />
        ))}
      </div>
    </>
  );
}
