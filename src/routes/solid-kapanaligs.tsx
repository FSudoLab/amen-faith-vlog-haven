import { createFileRoute } from "@tanstack/react-router";
import {
  Crown,
  Medal,
  Award,
  Sparkles,
  Heart,
  Check,
} from "lucide-react";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { useSolidKapanaligs } from "@/lib/kapanaligs";

export const Route = createFileRoute("/solid-kapanaligs")({
  head: () => ({
    meta: [
      { title: "Top 10 Solid Kapanaligs of the Month – AMEN" },
      {
        name: "description",
        content:
          "Pagpupugay at pasasalamat sa ating Top 10 Solid Kapanaligs of the Month sa karangalan ng Poong Maykapal.",
      },
      { property: "og:title", content: "Top 10 Solid Kapanaligs of the Month – AMEN" },
      {
        property: "og:description",
        content:
          "Kilalanin ang ating Gold, Silver, at Bronze Solid Kapanaligs of the month.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SolidKapanaligsPage,
});

function SolidKapanaligsPage() {
  const { kapanaligs } = useSolidKapanaligs();

  // Separate top 3 (Gold, Silver, Bronze) and 4-10
  const sorted = [...kapanaligs].sort((a, b) => a.rankNumber - b.rankNumber);
  const gold = sorted.find((k) => k.rankNumber === 1);
  const silver = sorted.find((k) => k.rankNumber === 2);
  const bronze = sorted.find((k) => k.rankNumber === 3);
  const runnersUp = sorted.filter((k) => k.rankNumber > 3);

  // If there are no 2 and 3, put 1st on the left side (md:order-1)
  const hasSilverOrBronze = Boolean(silver || bronze);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-heaven py-16 text-center">
        <div className="rays pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            <span>Parangal at Pagkilala · Edisyon: Oktubre 2026</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
          </div>

          <h1 className="mt-4 font-display text-4xl uppercase tracking-tight sm:text-5xl md:text-6xl text-foreground">
            Top 10 Solid Kapanaligs
          </h1>
          <p className="mt-2 font-display text-xl uppercase tracking-widest text-gold-dark">
            Of The Month
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Taos-pusong pasasalamat sa ating mga huwarang Kapanalig na buong pusong
            sumusuporta sa media ministry, pagpapalaganap ng salita ng Poong Maykapal, at
            biyaya sa ating komunidad.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-5 py-12">
        {/* TOP 3 PODIUM SECTION (GOLD, SILVER, BRONZE) */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl uppercase tracking-wide text-foreground">
              🏆 The Podium of Honor
            </h2>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
              Top 3 Gold, Silver, & Bronze Solid Kapanaligs
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 items-end">
            {/* 🥇 1st PLACE - GOLD (Always order-1 on mobile so it is at the TOP; on desktop: md:order-1 (left) if no 2 & 3, or md:order-2 (center) if 2 or 3 exist) */}
            {gold ? (
              <div
                className={`order-1 ${
                  hasSilverOrBronze ? "md:order-2 md:-translate-y-3" : "md:order-1"
                } relative rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-100/90 via-card to-yellow-100/70 dark:from-amber-950/70 dark:to-card p-7 text-center shadow-2xl hover:-translate-y-1.5 transition duration-300`}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 px-5 py-1.5 text-xs font-black uppercase tracking-wider text-amber-950 shadow-xl ring-2 ring-amber-300 animate-pulse">
                  <Crown className="h-4 w-4 text-amber-950" /> 1st Place · Gold Solid
                  <Sparkles className="h-3.5 w-3.5" />
                </div>

                <div className="mt-4 relative mx-auto h-36 w-36">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 blur-sm opacity-60 animate-pulse" />
                  <img
                    src={
                      gold.avatarUrl ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={gold.name}
                    className="relative h-36 w-36 rounded-full object-cover ring-4 ring-amber-400 ring-offset-4 ring-offset-background shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-1 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 font-display font-black text-amber-950 shadow-lg text-lg ring-2 ring-white">
                    1
                  </div>
                </div>

                <h3 className="mt-6 font-display text-2xl uppercase tracking-wide text-foreground">
                  {gold.name}
                </h3>
                {gold.badge && (
                  <span className="mt-1.5 inline-block rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-0.5 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                    👑 {gold.badge}
                  </span>
                )}
                <p className="mt-3.5 text-sm leading-relaxed text-muted-foreground">
                  "{gold.bio || "Walang sawang sumusuporta sa mga banal na misa at misyon ng AMEN."}"
                </p>
                <div className="mt-5 pt-3.5 border-t border-amber-300/40 flex items-center justify-between text-xs font-semibold text-amber-800 dark:text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" /> Solid Kapanalig of the Month
                  </span>
                  <span>{gold.month}</span>
                </div>
              </div>
            ) : (
              <EmptyPodiumSlot
                rank={1}
                title="1st Place · Gold"
                className={`order-1 ${
                  hasSilverOrBronze ? "md:order-2 md:-translate-y-3" : "md:order-1"
                }`}
              />
            )}

            {/* 🥈 2nd PLACE - SILVER (order-2 on mobile, on desktop: md:order-1 (left) if 2 or 3 exist, or md:order-2 (middle) if no other) */}
            {silver ? (
              <div
                className={`order-2 ${
                  hasSilverOrBronze ? "md:order-1" : "md:order-2"
                } relative rounded-3xl border-2 border-slate-300 dark:border-slate-700 bg-gradient-to-b from-slate-100/90 via-card to-slate-200/50 dark:from-slate-900/60 dark:to-card p-6 text-center shadow-lg hover:-translate-y-1 transition duration-300`}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-slate-400 via-gray-200 to-slate-400 px-4 py-1 text-xs font-black uppercase tracking-wider text-slate-900 shadow-md">
                  <Medal className="h-4 w-4" /> 2nd Place · Silver
                </div>

                <div className="mt-4 relative mx-auto h-28 w-28">
                  <img
                    src={
                      silver.avatarUrl ||
                      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={silver.name}
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-slate-300 ring-offset-4 ring-offset-background shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 font-display font-black text-slate-800 shadow">
                    2
                  </div>
                </div>

                <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-foreground">
                  {silver.name}
                </h3>
                {silver.badge && (
                  <span className="mt-1 inline-block rounded-full bg-slate-200 dark:bg-slate-800 px-3 py-0.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {silver.badge}
                  </span>
                )}
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  "{silver.bio || "Tapat na naglilingkod at kaagapay sa mga panalangin."}"
                </p>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> Kapanalig
                  </span>
                  <span>{silver.month}</span>
                </div>
              </div>
            ) : (
              <EmptyPodiumSlot
                rank={2}
                title="2nd Place · Silver"
                className={`order-2 ${
                  hasSilverOrBronze ? "md:order-1" : "md:order-2"
                }`}
              />
            )}

            {/* 🥉 3rd PLACE - BRONZE (order-3 on mobile, md:order-3 on desktop) */}
            {bronze ? (
              <div className="order-3 md:order-3 relative rounded-3xl border-2 border-amber-600/70 dark:border-amber-700 bg-gradient-to-b from-amber-100/60 via-card to-orange-100/40 dark:from-amber-950/50 dark:to-card p-6 text-center shadow-lg hover:-translate-y-1 transition duration-300">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 px-4 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md">
                  <Award className="h-4 w-4" /> 3rd Place · Bronze
                </div>

                <div className="mt-4 relative mx-auto h-28 w-28">
                  <img
                    src={
                      bronze.avatarUrl ||
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
                    }
                    alt={bronze.name}
                    className="h-28 w-28 rounded-full object-cover ring-4 ring-amber-600 ring-offset-4 ring-offset-background shadow-md"
                  />
                  <div className="absolute -bottom-2 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 font-display font-black text-white shadow">
                    3
                  </div>
                </div>

                <h3 className="mt-5 font-display text-2xl uppercase tracking-wide text-foreground">
                  {bronze.name}
                </h3>
                {bronze.badge && (
                  <span className="mt-1 inline-block rounded-full bg-amber-600/10 px-3 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                    {bronze.badge}
                  </span>
                )}
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                  "{bronze.bio || "Nangunguna sa kabataang Kapanalig para sa pagpapalaganap ng salita ng Diyos."}"
                </p>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> Kapanalig
                  </span>
                  <span>{bronze.month}</span>
                </div>
              </div>
            ) : (
              <EmptyPodiumSlot
                rank={3}
                title="3rd Place · Bronze"
                className="order-3 md:order-3"
              />
            )}
          </div>
        </section>

        {/* RANKS 4 TO 10 LIST */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-6">
            <div>
              <h2 className="font-display text-2xl uppercase tracking-wide text-foreground">
                Top 4 - 10 Solid Kapanaligs
              </h2>
              <p className="text-xs text-muted-foreground">
                Honorary Fellow Believers na may tapat na pagmamahal at paglilingkod.
              </p>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Ranked: {sorted.length} Kapanaligs
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {runnersUp.map((k) => (
              <div
                key={k.id}
                className="group relative flex items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-holy hover:border-gold/50"
              >
                {/* Number Badge */}
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 font-display text-lg font-bold text-primary group-hover:bg-gold group-hover:text-primary-foreground transition">
                  #{k.rankNumber}
                </div>

                {/* Avatar */}
                <img
                  src={
                    k.avatarUrl ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                  }
                  alt={k.name}
                  className="h-14 w-14 rounded-full object-cover border-2 border-border group-hover:border-gold transition flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-lg uppercase tracking-wide text-foreground truncate">
                      {k.name}
                    </h3>
                  </div>

                  {k.badge && (
                    <span className="inline-block mt-0.5 rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-semibold text-secondary-foreground">
                      {k.badge}
                    </span>
                  )}

                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {k.bio || "Kasama sa pananalig at pagpapala ng ating komunidad."}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-muted-foreground/80">
                    <span className="flex items-center gap-1">
                      <Check className="h-3 w-3 text-gold" /> Verified Supporter
                    </span>
                    <span>{k.month}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {runnersUp.length === 0 && (
            <p className="text-center py-10 text-muted-foreground text-sm">
              Walang ibang Kapanalig sa listahan.
            </p>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function EmptyPodiumSlot({
  rank,
  title,
  className = "",
}: {
  rank: number;
  title: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border-2 border-dashed border-border bg-card/40 p-6 text-center ${className}`}
    >
      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted text-muted-foreground font-display text-2xl font-bold">
        #{rank}
      </div>
      <h3 className="mt-4 font-display text-xl uppercase text-muted-foreground">
        {title}
      </h3>
      <p className="mt-1 text-xs text-muted-foreground">Wala pang nakatalaga.</p>
    </div>
  );
}
