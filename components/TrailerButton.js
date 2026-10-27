"use client";

import { useEffect, useState } from "react";

export default function TrailerButton({ videoKey, title }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!videoKey) {
    return (
      <span className="rounded bg-neutral-700/70 px-6 py-2 text-sm text-neutral-300">
        Tráiler no disponible
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-white px-6 py-2 font-semibold text-black transition hover:bg-neutral-300"
      >
        ▶ Ver tráiler
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`Tráiler de ${title}`}
        >
          <div
            className="relative aspect-video w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-sm text-neutral-300 hover:text-white"
            >
              Cerrar ✕
            </button>
            <iframe
              className="h-full w-full rounded"
              src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
              title={`Tráiler de ${title}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
}
