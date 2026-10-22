import { Link } from "@tanstack/react-router";
import { SiInstagram, SiTiktok, SiX, SiYoutube } from "react-icons/si";
import logo from "@/assets/amen-logo-clean.png.asset.json";
import { useAdmin } from "@/lib/vlogs";

export function SiteHeader() {
  const { admin, logout } = useAdmin();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Link to="/" className="flex items-center">
          <img src={logo.url} alt="AMEN - Arts of Matt Estrella Network" className="h-12" />
        </Link>
        <nav className="flex items-center gap-2 font-display text-sm uppercase tracking-wide">
          <Link to="/" className="rounded-full px-4 py-2 hover:bg-gold-soft" activeOptions={{ exact: true }} activeProps={{ className: "bg-gold" }}>
            Home
          </Link>
          <Link to="/vlogs" className="rounded-full px-4 py-2 hover:bg-gold-soft" activeProps={{ className: "bg-gold" }}>
            Vlogs
          </Link>
          {admin ? (
            <button onClick={logout} className="rounded-full bg-primary px-4 py-2 uppercase text-primary-foreground">
              Logout
            </button>
          ) : (
            <Link to="/login" className="rounded-full bg-primary px-4 py-2 text-primary-foreground">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

const socials = [
  { name: "Instagram", handle: "@matthewmatics19", href: "https://instagram.com/matthewmatics19", icon: SiInstagram },
  { name: "YouTube", handle: "@matthewmatics19", href: "https://youtube.com/@matthewmatics19", icon: SiYoutube },
  { name: "X (Twitter)", handle: "@matthewmatics19", href: "https://x.com/matthewmatics19", icon: SiX },
  { name: "TikTok", handle: "@matthewmatics", href: "https://tiktok.com/@matthewmatics", icon: SiTiktok },
];

export function Socials() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {socials.map((s) => (
        <a key={s.name} href={s.href} target="_blank" rel="noreferrer" className="rounded-2xl bg-primary p-6 text-primary-foreground shadow-holy transition hover:-translate-y-1">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-soft">
            <s.icon className="h-6 w-6 text-primary" aria-hidden />
          </span>
          <p className="mt-4 font-display text-xl uppercase text-gold">{s.name}</p>
          <p className="mt-1 opacity-90">{s.handle}</p>
        </a>
      ))}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-primary py-10 text-center text-primary-foreground">
      <p className="font-display text-2xl uppercase text-gold">AMEN</p>
      <p className="mt-2 text-sm opacity-80">Arts of Matt Estrella Network · Sa karangalan ng Poong Maykapal</p>
    </footer>
  );
}
