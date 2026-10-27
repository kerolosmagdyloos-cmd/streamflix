"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContinueWatching() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("sf-last")) || []);
    } catch {}
  }, []);

  if (!items.length) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 px-4 text-lg font-semibold md:px-12 md:text-xl">
        Continuar viendo
      </h2>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 py-2 md:px-12">
        {items.map((it) => (
          <Link
            key={it.id}
            href={`/title/tv/${it.id}?season=${it.season}#episodios`}
            className="group relative aspect-[2/3] w-36 shrink-0 overflow-hidden rounded-md bg-neutral-800 transition duration-300 hover:scale-105 md:w-44"
          >
            {it.poster ? (
              <img
                src={it.poster}
                alt={it.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-3 text-center text-sm font-semibold">
                {it.name}
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-2 pt-8">
              <p className="line-clamp-1 text-xs font-semibold">{it.name}</p>
              <p className="text-[11px] text-neutral-300">
                T{it.season} · E{it.episode} visto
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
