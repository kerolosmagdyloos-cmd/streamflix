"use client";

import { useEffect, useState } from "react";

const KEY = "sf-list"; // [{ id, type, title, poster, year }]

const read = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export default function MyListButton({ item }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(read().some((x) => x.id === item.id && x.type === item.type));
  }, [item.id, item.type]);

  const toggle = () => {
    const list = read().filter((x) => !(x.id === item.id && x.type === item.type));
    if (!saved) list.unshift(item);
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {}
    setSaved(!saved);
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={saved}
      className={`rounded border px-5 py-2 font-semibold transition ${
        saved
          ? "border-white bg-white/15 text-white hover:bg-white/25"
          : "border-neutral-400 text-white hover:border-white"
      }`}
    >
      {saved ? "✓ En mi lista" : "+ Mi lista"}
    </button>
  );
}
