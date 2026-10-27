import ContinueWatching from "@/components/ContinueWatching";
import Hero from "@/components/Hero";
import Row from "@/components/Row";
import SetupNotice from "@/components/SetupNotice";
import { getHome } from "@/lib/tmdb";

export default async function Home() {
  const { hero, rows } = await getHome();
  return (
    <>
      <Hero item={hero} />
      <div className="-mt-16 relative z-10">
        <SetupNotice />
        <ContinueWatching />
        {rows.map((r) => (
          <Row key={r.title} title={r.title} items={r.items} />
        ))}
      </div>
    </>
  );
}
