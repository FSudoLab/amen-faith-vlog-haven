import { createFileRoute, Link } from "@tanstack/react-router";
import logo from "@/assets/images/logo.png";
import mattHoldingPoon from "@/assets/images/matt-holding-poon.png";
import bible from "@/assets/images/bible.png";
import poonVid from "@/assets/images/poon-vid.mp4";
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

      <section className="relative flex min-h-[85vh] flex-col overflow-hidden bg-heaven">
        <div className="rays pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-end gap-10 px-5 pt-12 md:grid-cols-[1fr_1.1fr] md:gap-6 md:pt-16">
          <div className="max-w-xl self-center text-left">
            <p className="font-display text-3xl leading-snug md:text-4xl">
              “Para sa mas malawak na misyon ng bawat Kapanalig sa karangalan ng Poong Maykapal”
            </p>
            <p className="mt-4 text-muted-foreground">
              For the greater mission of every Fellow Believer in the honor and glory of the Almighty God
            </p>
            <Link to="/vlogs" className="mt-8 inline-block rounded-full bg-primary px-8 py-4 font-display uppercase text-primary-foreground shadow-holy">
              Panoorin ang Vlogs
            </Link>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute bottom-0 right-0 h-2/3 w-2/3 rounded-full bg-halo/50 blur-3xl" />
            <img
              src={mattHoldingPoon}
              alt="Matt Estrella holding Poong Nazareno"
              className="matt-sway relative ml-auto block w-full max-w-[40rem] drop-shadow-[0_25px_35px_rgba(30,58,138,0.25)]"
            />
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-video-surface">
        <video
          src={poonVid}
          className="block aspect-video w-full bg-video-surface object-contain"
          controls
          autoPlay
          muted
          loop
          playsInline
        />
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="text-center font-display text-5xl uppercase">AMEN</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {acrostic.map(([l, t]) => (
            <div key={l} className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-holy transition hover:-translate-y-1">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gold font-display text-4xl ring-4 ring-halo/40">{l}</span>
              <p className="text-lg font-medium">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative bg-primary text-primary-foreground">
        {/* Radiant Bible at the top right of Bisyon & Misyon (bottom right of AMEN 4) */}
        <div className="pointer-events-none absolute -top-16 right-4 sm:-top-20 sm:right-8 md:-top-24 md:right-12 z-20">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-halo/40 blur-2xl scale-125" />
            <img
              src={bible}
              alt="Banal na Bibliya"
              className="relative h-32 w-32 sm:h-44 sm:w-44 md:h-52 md:w-52 object-contain drop-shadow-[0_20px_35px_rgba(234,179,8,0.5)] transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
          <div>
            <p className="font-display uppercase tracking-widest text-gold">Bisyon — AMEN</p>
            <p className="mt-4 text-lg leading-relaxed opacity-95">
              Ang AMEN – Arts of Matt Estrella Network ay isang makabagong ministeryo ng komunikasyon na naglilinang ng
              malikhaing pagpapahayag ng pananampalataya, nagpapalaganap ng katotohanan, at nagsisilbing daluyan ng
              pag-asa para sa Simbahan at sambayanang Pilipino.
            </p>
          </div>
          <div className="sm:pr-20 md:pr-28">
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
        <img src={logo} alt="AMEN – Arts of Matt Estrella Network" className="mx-auto w-full max-w-sm drop-shadow-[0_12px_24px_rgba(30,58,138,0.18)]" />
        <h2 className="mt-8 text-center font-display text-4xl uppercase">Kumonekta kay Matt</h2>
        <div className="mt-10">
          <Socials />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
