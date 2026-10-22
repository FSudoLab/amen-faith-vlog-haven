import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/amen-logo.png.asset.json";
import { SiteFooter, SiteHeader, Socials } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AMEN – Arts of Matt Estrella Network" },
      { name: "description", content: "Faith vlogs and creative ministry by Matt Estrella, for every Kapanalig in honor of the Almighty God." },
      { property: "og:title", content: "AMEN – Arts of Matt Estrella Network" },
      { property: "og:description", content: "Faith vlogs and creative ministry by Matt Estrella." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const acrostic = [
  ["A", "Alab ng pag-ibig sa Diyos ating ibahagi"],
  ["M", "Misyon ng pananampalataya ating pagyabungin"],
  ["E", "Ebanghelyo at katotohanan ating ipahayag"],
  ["N", "Nagkakaisang Kapanalig sa pananalig"],
];

const misyon = [
  "Itaas ang Ebanghelyo sa pamamagitan ng sining, media, at makabuluhang nilalaman;",
  "Maglingkod sa Diyos at sa Kapwa sa pagbabalita ng mga kaganapan sa Simbahan at lipunan;",
  "Makaisa ang mga kapanalig na may malalim na pananampalataya, kabutihan, at pagkakaisa; at",
  "Mag-ambag sa paghubog ng kulturang maka-Diyos na nagbibigay liwanag sa panahon ng hamon at pagbabago.",
];

function Index() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden bg-heaven">
        <div className="rays pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 py-20 text-center">
          <img src={logo.url} alt="AMEN logo" className="mx-auto w-full max-w-xl mix-blend-multiply" />
          <p className="mx-auto mt-10 max-w-2xl font-display text-2xl leading-snug md:text-3xl">
            “Para sa mas malawak na misyon ng bawat Kapanalig sa karangalan ng Poong Maykapal”
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            For the greater mission of every Fellow Believer in the honor and glory of the Almighty God
          </p>
          <Link to="/vlogs" className="mt-8 inline-block rounded-full bg-primary px-8 py-4 font-display uppercase text-primary-foreground shadow-holy">
            Panoorin ang Vlogs
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center font-display text-5xl uppercase">AMEN</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {acrostic.map(([l, t]) => (
            <div key={l} className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-holy">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold font-display text-4xl ring-4 ring-halo/40">{l}</span>
              <p className="text-lg">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
          <div>
            <p className="font-display uppercase tracking-widest text-gold">Bisyon — AMEN</p>
            <p className="mt-4 text-lg leading-relaxed opacity-95">
              Ang AMEN – Arts of Matt Estrella Network ay isang makabagong ministeryo ng komunikasyon na naglilinang ng
              malikhaing pagpapahayag ng pananampalataya, nagpapalaganap ng katotohanan, at nagsisilbing daluyan ng
              pag-asa para sa Simbahan at sambayanang Pilipino.
            </p>
          </div>
          <div>
            <p className="font-display uppercase tracking-widest text-gold">Misyon — AMEN</p>
            <p className="mt-4 opacity-95">Ang AMEN ay may layuning:</p>
            <ul className="mt-3 space-y-3">
              {misyon.map((m) => (
                <li key={m} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gold" />
                  <span className="opacity-95">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center font-display text-4xl uppercase">Kumonekta kay Matt</h2>
        <div className="mt-10">
          <Socials />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
