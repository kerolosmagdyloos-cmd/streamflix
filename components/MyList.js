"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const KEY = "sf-list";

export default function MyList() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem(KEY)) || []);
    } catch {
      setItems([]);
    }
  }, []);

  const remove = (it) => {
    const next = items.filter((x) => !(x.id === it.id && x.type === it.type));
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    setItems(next);
  };

  if (items === null) return null;

  if (!items.length) {
    return (
      <div className="text-neutral-400">
        <p>Todavía no has guardado nada.</p>
        <p className="mt-1 text-sm">
          Abre una serie o película y pulsa <b>+ Mi lista</b>.
        </p>
        <Link
          href="/explorar/tv"
          className="mt-4 inline-block rounded bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-neutral-300"
        >
          Explorar series
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {items.map((it) => (
        <div key={`${it.type}-${it.id}`} className="group relative">
          <Link
            href={`/title/${it.type}/${it.id}`}
            className="block aspect-[2/3] overflow-hidden rounded-md bg-neutral-800 transition duration-300 group-hover:scale-105"
          >
            {it.poster ? (
              <img
                src={it.poster}
                alt={it.title}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-3 text-center text-sm font-semibold">
                {it.title}
              </div>
            )}
          </Link>
          <p className="mt-2 line-clamp-1 text-sm font-medium">{it.title}</p>
          <p className="text-xs text-neutral-400">
            {[it.type === "tv" ? "Serie" : "Película", it.year]
              .filter(Boolean)
              .join(" · ")}
          </p>
          <button
            onClick={() => remove(it)}
            aria-label={`Quitar ${it.title} de mi lista`}
            className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white opacity-0 transition hover:bg-black group-hover:opacity-100 focus:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
