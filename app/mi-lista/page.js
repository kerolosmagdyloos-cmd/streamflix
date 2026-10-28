import MyList from "@/components/MyList";

export const metadata = { title: "Mi lista – StreamFlix" };

export default function MiLista() {
  return (
    <div className="px-4 pb-10 pt-28 md:px-12">
      <h1 className="mb-2 text-2xl font-semibold">Mi lista</h1>
      <p className="mb-6 text-sm text-neutral-400">
        Se guarda en este navegador y dispositivo.
      </p>
      <MyList />
    </div>
  );
}
