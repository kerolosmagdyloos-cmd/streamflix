"use client";

import { useEffect, useState } from "react";

// Reproduce un vídeo propio (mp4) en una ventana modal.
export default function VideoPlayer({
  src,
  title,
  label = "▶ Reproducir",
  className = "rounded bg-brand px-6 py-2 font-semibold text-white transition hover:bg-red-700",
  onPlay,
}) {
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

  if (!src) return null;

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          onPlay?.();
        }}
        className={className}
      >
        {label}
      </button>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-sm text-neutral-300 hover:text-white"
            >
              Cerrar ✕
            </button>
            <video
              src={src}
              controls
              autoPlay
              className="aspect-video w-full rounded bg-black"
            />
            <p className="mt-2 text-sm text-neutral-300">{title}</p>
          </div>
        </div>
      )}
    </>
  );
}
