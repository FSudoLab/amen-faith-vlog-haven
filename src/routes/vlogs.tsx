// ============= Vlogs page =============
// Layout: vlog boxes (title / image / description / date) fill the right side at
// max width, and the Santo Niño stands big on the LEFT edge, head at the 1:30
// clock position (45deg clockwise from upright).

import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import poonVlog from "@/assets/images/poon-vlog.png";
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

const empty: Omit<Vlog, "id"> = {
  title: "",
  description: "",
  videoUrl: "",
  imageUrl: "",
  date: new Date().toISOString().slice(0, 10),
};

function Vlogs() {
  const { vlogs, add, update, remove } = useVlogs();
  const { admin } = useAdmin();
  const [form, setForm] = useState<Omit<Vlog, "id">>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) update({ ...form, id: editId });
    else add(form);
    setForm(empty);
    setEditId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <section className="relative overflow-hidden bg-heaven py-16 text-center">
        <div className="rays pointer-events-none absolute inset-0" />
        <h1 className="relative font-display text-5xl uppercase md:text-6xl">Vlogs</h1>
        <p className="relative mt-3 text-muted-foreground">Mga kwento ng pananampalataya, pag-asa at pagkakaisa</p>
      </section>

      <section className="relative overflow-clip">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-5 py-14 md:grid-cols-[240px_minmax(0,1fr)]">
        <aside aria-hidden className="pointer-events-none relative hidden md:block">
          <div className="vlog-figure sticky top-28">
            <img src={poonVlog} alt="Poong Nazareno" className="drop-shadow-2xl" />
          </div>
        </aside>
        <div className="min-w-0">
        {admin && (
          <form onSubmit={submit} className="mb-12 grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-holy md:grid-cols-2">
            <h2 className="font-display text-2xl uppercase md:col-span-2">{editId ? "Edit vlog" : "New vlog"}</h2>
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-input bg-background px-4 py-3" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="rounded-lg border border-input bg-background px-4 py-3" />
            <input placeholder="YouTube link (optional)" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} className="rounded-lg border border-input bg-background px-4 py-3 md:col-span-2" />
            
            <div className="md:col-span-2 space-y-2 rounded-xl border border-dashed border-border p-4 bg-muted/20">
              <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground">
                Add Image / Thumbnail
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-gold-soft transition shadow-sm"
                >
                  <ImagePlus className="h-4 w-4 text-primary" />
                  <span>{form.imageUrl ? "Change Image" : "Upload Image"}</span>
                </button>
                <span className="text-xs text-muted-foreground">or paste image URL:</span>
                <input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl || ""}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="flex-1 min-w-[200px] rounded-lg border border-input bg-background px-4 py-2 text-sm"
                />
              </div>

              {form.imageUrl && (
                <div className="relative mt-3 inline-block">
                  <img
                    src={form.imageUrl}
                    alt="Preview"
                    className="h-28 w-48 rounded-lg object-cover border border-border shadow"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, imageUrl: "" });
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow hover:opacity-90"
                    title="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg border border-input bg-background px-4 py-3 md:col-span-2" rows={3} />
            <div className="flex gap-3 md:col-span-2">
              <button className="rounded-full bg-primary px-6 py-3 font-display uppercase text-primary-foreground">{editId ? "Save" : "Post"}</button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setForm(empty); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="rounded-full bg-secondary px-6 py-3 font-display uppercase">
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        <div className="flex flex-col gap-8">
          {vlogs.length === 0 && <p className="text-center text-muted-foreground">Wala pang vlogs.</p>}
          {vlogs.map((v) => {
            const embed = toEmbed(v.videoUrl);
            return (
              <article key={v.id} className="rounded-2xl border border-border bg-card p-6 shadow-holy">
                <h3 className="font-display text-2xl uppercase md:text-3xl">{v.title}</h3>
                <div className="mt-4 aspect-video overflow-hidden rounded-xl bg-heaven">
                  {embed ? (
                    <iframe src={embed} title={v.title} className="h-full w-full" allowFullScreen />
                  ) : v.imageUrl ? (
                    <img src={v.imageUrl} alt={v.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="relative flex h-full items-center justify-center overflow-hidden bg-primary/10">
                      <img src={poonVlog} alt={v.title} className="h-full w-full object-cover opacity-80" />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-primary/90 via-primary/30 to-transparent p-6">
                        <span className="font-display text-2xl uppercase text-gold">AMEN Faith Vlog</span>
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground/80">{v.date}</p>
                {admin && (
                  <div className="mt-4 flex gap-2 text-sm">
                    <button onClick={() => { setEditId(v.id); setForm({ title: v.title, description: v.description, videoUrl: v.videoUrl, imageUrl: v.imageUrl || "", date: v.date }); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="rounded-full bg-secondary px-4 py-1.5">
                      Edit
                    </button>
                    <button onClick={() => confirm("Delete this vlog?") && remove(v.id)} className="rounded-full bg-destructive px-4 py-1.5 text-destructive-foreground">
                      Delete
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
      </div>
      </section>
      <SiteFooter />
    </div>
  );
}
