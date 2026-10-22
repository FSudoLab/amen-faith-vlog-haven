import { useEffect, useState } from "react";

export type Vlog = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  date: string;
};

const KEY = "amen-vlogs";
const AUTH = "amen-admin";

const seed: Vlog[] = [
  {
    id: "1",
    title: "Simbang Gabi Diaries",
    description: "Isang gabi ng panalangin at pagkakaisa kasama ang mga kapanalig.",
    videoUrl: "",
    date: "2026-10-01",
  },
  {
    id: "2",
    title: "Alab ng Pananampalataya",
    description: "Mga kwento ng pag-asa mula sa ating komunidad.",
    videoUrl: "",
    date: "2026-09-15",
  },
];

function read(): Vlog[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) return seed;
  try {
    return JSON.parse(raw);
  } catch {
    return seed;
  }
}

export function useVlogs() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  useEffect(() => setVlogs(read()), []);
  const save = (next: Vlog[]) => {
    setVlogs(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };
  return {
    vlogs,
    add: (v: Omit<Vlog, "id">) => save([{ ...v, id: crypto.randomUUID() }, ...vlogs]),
    update: (v: Vlog) => save(vlogs.map((x) => (x.id === v.id ? v : x))),
    remove: (id: string) => save(vlogs.filter((x) => x.id !== id)),
  };
}

export function useAdmin() {
  const [admin, setAdmin] = useState(false);
  useEffect(() => setAdmin(localStorage.getItem(AUTH) === "1"), []);
  return {
    admin,
    login: () => {
      localStorage.setItem(AUTH, "1");
      setAdmin(true);
    },
    logout: () => {
      localStorage.removeItem(AUTH);
      setAdmin(false);
    },
  };
}

export function toEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
