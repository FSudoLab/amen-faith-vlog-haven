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

export function useVlogs() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);

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
        setVlogs(mapped);
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

export function toEmbed(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
}
