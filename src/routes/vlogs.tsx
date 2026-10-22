import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteFooter, SiteHeader } from "@/components/SiteHeader";
import { toEmbed, useAdmin, useVlogs, type Vlog } from "@/lib/vlogs";

export const Route = createFileRoute("/vlogs")({
  head: () => ({
    meta: [
      { title: "Vlogs – AMEN" },
      { name: "description", content: "Watch the latest faith vlogs from Matt Estrella of AMEN." },
      { property: "og:title", content: "Vlogs – AMEN" },
      { property: "og:description", content: "Watch the latest faith vlogs from Matt Estrella." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Vlogs,
});

const empty = { title: "", description: "", videoUrl: "", date: new Date().toISOString().slice(0, 10) };

function Vlogs() {
  const { vlogs, add, update, remove } = useVlogs();
  const { admin } = useAdmin();
  const [form, setForm] = useState<Omit<Vlog, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) update({ ...form, id: editId });
    else add(form);
    setForm(empty);
    setEditId(null);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="relative overflow-hidden bg-heaven py-16 text-center">
        <div className="rays pointer-events-none absolute inset-0" />
        <h1 className="relative font-display text-5xl uppercase md:text-6xl">Vlogs</h1>
        <p className="relative mt-3 text-muted-foreground">Mga kwento ng pananampalataya, pag-asa at pagkakaisa</p>
      </section>

      <div className="mx-auto max-w-6xl px-5 py-14">
        {admin && (
          <form onSubmit={submit} className="mb-12 grid gap-3 rounded-2xl border border-border bg-card p-6 shadow-holy md:grid-cols-2">
            <h2 className="font-display text-2xl uppercase md:col-span-2">{editId ? "Edit vlog" : "New vlog"}</h2>
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-input bg-background px-4 py-3" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-lg border border-input bg-background px-4 py-3" />
            <input placeholder="YouTube link" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className="rounded-lg border border-input bg-background px-4 py-3 md:col-span-2" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-input bg-background px-4 py-3 md:col-span-2" rows={3} />
            <div className="flex gap-3 md:col-span-2">
              <button className="rounded-full bg-primary px-6 py-3 font-display uppercase text-primary-foreground">{editId ? "Save" : "Post"}</button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm(empty); }} className="rounded-full bg-secondary px-6 py-3 font-display uppercase">
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {vlogs.length === 0 && <p className="text-center text-muted-foreground">Wala pang vlogs.</p>}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {vlogs.map((v) => {
            const embed = toEmbed(v.videoUrl);
            return (
              <article key={v.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-holy">
                <div className="aspect-video bg-heaven">
                  {embed ? (
                    <iframe src={embed} title={v.title} className="h-full w-full" allowFullScreen />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-4xl text-primary/70">AMEN</div>
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{v.date}</p>
                  <h3 className="mt-1 font-display text-xl uppercase">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{v.description}</p>
                  {admin && (
                    <div className="mt-4 flex gap-2 text-sm">
                      <button onClick={() => { setEditId(v.id); setForm({ title: v.title, description: v.description, videoUrl: v.videoUrl, date: v.date }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-full bg-secondary px-4 py-1.5">
                        Edit
                      </button>
                      <button onClick={() => confirm("Delete this vlog?") && remove(v.id)} className="rounded-full bg-destructive px-4 py-1.5 text-destructive-foreground">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
