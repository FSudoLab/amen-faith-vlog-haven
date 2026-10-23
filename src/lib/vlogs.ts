import { useEffect, useState } from "react";
import { supabase } from "./supabase";

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

const AUTH = "amen-admin";

// Pre-made creator credentials
export const PREMADE_CREDENTIALS = {
  email: "matthew1@gmail.com",
  password: "Password*123",
};

const VLOGS_CACHE_KEY = "amen-cached-vlogs";
let memoryVlogsCache: Vlog[] | null = null;

function getInitialVlogs(): Vlog[] {
  if (memoryVlogsCache && memoryVlogsCache.length > 0) {
    return memoryVlogsCache;
  }
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(VLOGS_CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          memoryVlogsCache = parsed;
          return parsed;
        }
      }
    } catch {
      // ignore
    }
  }
  return [];
}

export function useVlogs() {
  const [vlogs, setVlogs] = useState<Vlog[]>(getInitialVlogs);
  const [loading, setLoading] = useState(() => vlogs.length === 0);

  const fetchVlogs = async () => {
    try {
      const { data, error } = await supabase
        .from("vlogs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        const mapped: Vlog[] = data.map((d: DbVlog) => ({
          id: String(d.id),
          title: d.title,
          description: d.description || "",
          videoUrl: d.video_url || d.videoUrl || "",
          imageUrl: d.image_url || d.imageUrl || "",
          date: d.date || new Date().toISOString().slice(0, 10),
        }));
        memoryVlogsCache = mapped;
        setVlogs(mapped);
        if (typeof window !== "undefined") {
          localStorage.setItem(VLOGS_CACHE_KEY, JSON.stringify(mapped));
        }
      }
    } catch (err) {
      console.error("Failed to load vlogs from Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVlogs();

    // Subscribe to Supabase Realtime changes across all connected devices
    const channel = supabase
      .channel("vlogs-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "vlogs" },
        () => {
          fetchVlogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const add = async (v: Omit<Vlog, "id">) => {
    const id = crypto.randomUUID();
    const newVlog: Vlog = { ...v, id };

    // Instant optimistic update
    const updated = [newVlog, ...vlogs];
    memoryVlogsCache = updated;
    setVlogs(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(VLOGS_CACHE_KEY, JSON.stringify(updated));
    }

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

      if (error) {
        console.error("Supabase insert error:", error.message);
      } else {
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
            // non-fatal if images table is pending
          }
        }
        await fetchVlogs();
      }
    } catch (err) {
      console.error("Failed to add vlog to Supabase:", err);
    }
  };

  const update = async (v: Vlog) => {
    // Instant optimistic update
    const updated = vlogs.map((item) => (item.id === v.id ? v : item));
    memoryVlogsCache = updated;
    setVlogs(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(VLOGS_CACHE_KEY, JSON.stringify(updated));
    }

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

      await fetchVlogs();
    } catch (err) {
      console.error("Supabase update error:", err);
    }
  };

  const remove = async (id: string) => {
    // Instant optimistic update
    const updated = vlogs.filter((item) => item.id !== id);
    memoryVlogsCache = updated;
    setVlogs(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(VLOGS_CACHE_KEY, JSON.stringify(updated));
    }

    try {
      await supabase.from("vlogs").delete().eq("id", id);
      await fetchVlogs();
    } catch (err) {
      console.error("Supabase delete error:", err);
    }
  };

  return {
    vlogs,
    loading,
    add,
    update,
    remove,
    refresh: fetchVlogs,
  };
}

const AUTH_EVENT = "amen-auth-event";

export function useAdmin() {
  const [admin, setAdmin] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(AUTH) === "1";
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAuth = () => {
      setAdmin(localStorage.getItem(AUTH) === "1");
    };

    // Listen for instant in-tab auth changes and cross-tab storage changes
    window.addEventListener(AUTH_EVENT, syncAuth);
    window.addEventListener("storage", syncAuth);

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        localStorage.setItem(AUTH, "1");
        setAdmin(true);
        window.dispatchEvent(new Event(AUTH_EVENT));
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        localStorage.setItem(AUTH, "1");
        setAdmin(true);
        window.dispatchEvent(new Event(AUTH_EVENT));
      } else {
        const isLocalAdmin = localStorage.getItem(AUTH) === "1";
        if (!isLocalAdmin) {
          setAdmin(false);
          window.dispatchEvent(new Event(AUTH_EVENT));
        }
      }
    });

    return () => {
      window.removeEventListener(AUTH_EVENT, syncAuth);
      window.removeEventListener("storage", syncAuth);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
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
      window.dispatchEvent(new Event(AUTH_EVENT));
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

    // 1. Try Supabase Auth
    if (email && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data.session) {
        localStorage.setItem(AUTH, "1");
        setAdmin(true);
        window.dispatchEvent(new Event(AUTH_EVENT));
        return { success: true };
      }

      // If user matches pre-made credentials, grant access and create session
      const isPremade =
        cleanEmail === PREMADE_CREDENTIALS.email.toLowerCase() &&
        password === PREMADE_CREDENTIALS.password;

      if (isPremade) {
        localStorage.setItem(AUTH, "1");
        setAdmin(true);
        window.dispatchEvent(new Event(AUTH_EVENT));
        return { success: true };
      }

      return {
        success: false,
        error: error?.message || "Invalid credentials",
      };
    }

    return {
      success: false,
      error: "Invalid email or password.",
    };
  };

  const logout = async () => {
    localStorage.removeItem(AUTH);
    setAdmin(false);
    window.dispatchEvent(new Event(AUTH_EVENT));
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore logout errors
    }
  };

  return {
    admin,
    loading,
    login,
    signUp,
    logout,
  };
};

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const clean = url.trim();
  // Support youtu.be, m.youtube.com, watch?v=, watch?...&v=, shorts/, live/, and embed/
  const m = clean.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/i
  );
  if (m && m[1]) return m[1];
  const fallback = clean.match(/(?:youtu\.be\/|v=|\/v\/|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/i);
  return fallback && fallback[1] ? fallback[1] : null;
}

export function toEmbed(url: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  // &playsinline=1 allows iOS and Android mobile browsers to play inline without breaking
  return `https://www.youtube.com/embed/${id}?playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
}

export function getYouTubeWatchUrl(url?: string): string | null {
  const id = extractYouTubeId(url);
  if (!id) return null;
  return `https://www.youtube.com/watch?v=${id}`;
}

