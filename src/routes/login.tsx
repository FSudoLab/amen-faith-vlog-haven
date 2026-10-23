import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useAdmin } from "@/lib/vlogs";

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
  const { login } = useAdmin();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, pw);
      if (res.success) {
        nav({ to: "/vlogs" });
      } else {
        setError(res.error || "Invalid email or password.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-heaven">
      <SiteHeader />
      <div className="px-5 py-20">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-md space-y-5 rounded-2xl border border-border bg-card p-8 shadow-holy"
        >
          <div className="space-y-1 text-center">
            <h1 className="font-display text-3xl uppercase text-foreground">Creator Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to manage vlogs.
            </p>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Email</label>
            <input
              required
              type="email"
              placeholder="name@example.com"
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-primary py-3.5 font-display text-base uppercase text-primary-foreground shadow transition hover:opacity-95 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
