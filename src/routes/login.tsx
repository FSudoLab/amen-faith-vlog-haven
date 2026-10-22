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
  return (
    <div className="min-h-screen bg-heaven">
      <SiteHeader />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login();
          nav({ to: "/vlogs" });
        }}
        className="mx-auto mt-20 max-w-sm space-y-4 rounded-2xl bg-card p-8 shadow-holy"
      >
        <h1 className="font-display text-3xl uppercase">Creator Login</h1>
        <p className="text-sm text-muted-foreground">Demo login — any email and password works.</p>
        <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-3" />
        <input required type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full rounded-lg border border-input bg-background px-4 py-3" />
        <button className="w-full rounded-full bg-primary py-3 font-display uppercase text-primary-foreground">Login</button>
      </form>
    </div>
  );
}
