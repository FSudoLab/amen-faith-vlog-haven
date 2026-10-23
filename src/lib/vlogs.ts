import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

export type Vlog = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  imageUrl?: string;
  date: string;
};

type DbVlog = {
  id: string;
  title: string;
  description?: string | null;
  video_url?: string | null;
  videoUrl?: string | null;
  image_url?: string | null;
  imageUrl?: string | null;
  date?: string | null;
};

const KEY = "amen-vlogs";
const AUTH = "amen-admin";

// Pre-made creator credentials
export const PREMADE_CREDENTIALS = {
  email: "matthew1@gmail.com",
  password: "Password*123",
};

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
  if (typeof window === "undefined") return seed;
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

  const fetchVlogs = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("vlogs")
          .select("*")
          .order("date", { ascending: false });

        if (!error && data && data.length > 0) {
          const mapped: Vlog[] = data.map((d: DbVlog) => ({
            id: String(d.id),
            title: d.title,
            description: d.description || "",
            videoUrl: d.video_url || d.videoUrl || "",
            imageUrl: d.image_url || d.imageUrl || "",
            date: d.date || new Date().toISOString().slice(0, 10),
          }));
          setVlogs(mapped);
          return;
        }
      } catch (err) {
        console.warn("Could not load from Supabase table, using local storage:", err);
      }
    }
    setVlogs(read());
  };

  useEffect(() => {
    fetchVlogs();
  }, []);

  const save = async (next: Vlog[]) => {
    setVlogs(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const add = async (v: Omit<Vlog, "id">) => {
    const id = crypto.randomUUID();
    const newVlog: Vlog = { ...v, id };

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from("vlogs").insert([
          {
            id: newVlog.id,
            title: newVlog.title,
            description: newVlog.description,
            video_url: newVlog.videoUrl,
            image_url: newVlog.imageUrl || "",
            date: newVlog.date,
          },
        ]);
        if (newVlog.imageUrl) {
          try {
            await supabase.from("images").insert([
              {
                vlog_id: newVlog.id,
                url: newVlog.imageUrl,
                caption: newVlog.title,
              },
            ]);
          } catch {
            // ignore image table error if table not yet created
          }
        }
        if (!error) {
          setVlogs([newVlog, ...vlogs]);
          return;
        }
        console.warn("Supabase insert error:", error.message);
      } catch (err) {
        console.warn("Failed to insert to Supabase:", err);
      }
    }
    save([newVlog, ...vlogs]);
  };

  const update = async (v: Vlog) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase
          .from("vlogs")
          .update({
            title: v.title,
            description: v.description,
            video_url: v.videoUrl,
            image_url: v.imageUrl || "",
            date: v.date,
          })
          .eq("id", v.id);
      } catch (err) {
        console.warn("Supabase update error:", err);
      }
    }
    save(vlogs.map((x) => (x.id === v.id ? v : x)));
  };

  const remove = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("vlogs").delete().eq("id", id);
      } catch (err) {
        console.warn("Supabase delete error:", err);
      }
    }
    save(vlogs.filter((x) => x.id !== id));
  };

  return {
    vlogs,
    add,
    update,
    remove,
    refresh: fetchVlogs,
  };
}

export function useAdmin() {
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLocalAdmin = localStorage.getItem(AUTH) === "1";
    setAdmin(isLocalAdmin);

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          localStorage.setItem(AUTH, "1");
          setAdmin(true);
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          localStorage.setItem(AUTH, "1");
          setAdmin(true);
        } else if (!isLocalAdmin) {
          setAdmin(false);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: "Supabase URL is not configured in .env" };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      return { success: false, error: error.message };
    }
    if (data.session) {
      localStorage.setItem(AUTH, "1");
      setAdmin(true);
    }
    return {
      success: true,
      message: data.session
        ? "User created and signed in successfully!"
        : "User created! Please check your email to confirm, or if email confirmation is disabled in Supabase, you can now sign in.",
    };
  };

  const login = async (email?: string, password?: string) => {
    const cleanEmail = email?.trim().toLowerCase();

    // 1. Try Supabase Auth if configured
    if (isSupabaseConfigured && supabase && email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.session) {
        localStorage.setItem(AUTH, "1");
        setAdmin(true);
        return { success: true };
      }

      // If Supabase gave "Invalid login credentials", check if user matches pre-made
      const isPremade =
        cleanEmail === PREMADE_CREDENTIALS.email.toLowerCase() &&
        password === PREMADE_CREDENTIALS.password;

      if (isPremade) {
        // Automatically attempt to register in Supabase if user doesn't exist yet
        try {
          const signUpRes = await supabase.auth.signUp({
            email: PREMADE_CREDENTIALS.email,
            password: PREMADE_CREDENTIALS.password,
          });
          if (signUpRes.data.session) {
            localStorage.setItem(AUTH, "1");
            setAdmin(true);
            return { success: true };
          }
        } catch {
          // ignore signup fallback errors
        }

        // Grant local access so creator is never locked out
        localStorage.setItem(AUTH, "1");
        setAdmin(true);
        return { success: true };
      }

      return {
        success: false,
        error: error?.message || "Invalid credentials",
      };
    }

    // 2. Fallback when Supabase is not yet configured with a valid remote URL
    const isPremade =
      cleanEmail === PREMADE_CREDENTIALS.email.toLowerCase() &&
      password === PREMADE_CREDENTIALS.password;

    if (isPremade) {
      localStorage.setItem(AUTH, "1");
      setAdmin(true);
      return { success: true };
    }

    return {
      success: false,
      error: "Invalid email or password. Use the pre-made credentials.",
    };
  };

  const logout = async () => {
    localStorage.removeItem(AUTH);
    setAdmin(false);
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  };

  return {
    admin,
    loading,
    login,
    signUp,
    logout,
  };
}

export function toEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
