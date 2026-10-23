import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { PREMADE_CREDENTIALS, useAdmin } from "@/lib/vlogs";
import { isSupabaseConfigured } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login – AMEN" },
      { name: "description", content: "Creator login for AMEN – Arts of Matt Estrella Network." },
      { property: "og:title", content: "Login – AMEN" },
      { property: "og:description", content: "Creator login for AMEN." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const { login, signUp } = useAdmin();
  const nav = useNavigate();
  const [email, setEmail] = useState(PREMADE_CREDENTIALS.email);
  const [pw, setPw] = useState(PREMADE_CREDENTIALS.password);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, pw);
      if (res.success) {
        nav({ to: "/vlogs" });
      } else {
        setError(res.error || "Authentication failed");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterInSupabase = async () => {
    setError(null);
    setInfo(null);
    setIsSubmitting(true);
    try {
      const res = await signUp(email, pw);
      if (res.success) {
        setInfo(res.message || "User created in Supabase! You can now log in.");
      } else {
        setError(res.error || "Failed to register user in Supabase");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating user in Supabase");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillPremade = () => {
    setEmail(PREMADE_CREDENTIALS.email);
    setPw(PREMADE_CREDENTIALS.password);
    setError(null);
    setInfo(null);
  };

  return (
    <div className="min-h-screen bg-heaven">
      <SiteHeader />
      <div className="px-5 py-16">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md space-y-5 rounded-2xl border border-border bg-card p-8 shadow-holy"
        >
          <div className="space-y-1">
            <h1 className="font-display text-3xl uppercase text-foreground">Creator Login</h1>
            <p className="text-sm text-muted-foreground">
              Sign in with your account to post and manage vlogs in the database.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {info && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
              {info}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              required
              type="email"
              placeholder="matthew1@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Password</label>
            <input
              required
              type="password"
              placeholder="••••••••••••"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary py-3.5 font-display text-base uppercase text-primary-foreground shadow transition hover:opacity-95 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>

            {isSupabaseConfigured && (
              <button
                type="button"
                onClick={handleRegisterInSupabase}
                disabled={isSubmitting}
                className="w-full rounded-full border border-border bg-background py-2.5 font-display text-sm uppercase text-foreground transition hover:bg-muted disabled:opacity-50"
              >
                Create / Sync User in Supabase
              </button>
            )}
          </div>

          <div className="rounded-xl border border-border/80 bg-background/60 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Pre-made Account</span>
              <button
                type="button"
                onClick={fillPremade}
                className="text-primary underline hover:opacity-80"
              >
                Auto-fill
              </button>
            </div>
            <p className="text-muted-foreground">
              Email: <code className="text-foreground">{PREMADE_CREDENTIALS.email}</code>
            </p>
            <p className="text-muted-foreground">
              Password: <code className="text-foreground">{PREMADE_CREDENTIALS.password}</code>
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  isSupabaseConfigured ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {isSupabaseConfigured
                ? "Connected to Supabase"
                : "Supabase key loaded (waiting for VITE_SUPABASE_URL in .env)"}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
