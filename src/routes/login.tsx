import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Crown,
  Medal,
  Award,
  Sparkles,
  Video,
  Trophy,
  ImagePlus,
  Trash2,
  Edit2,
  ExternalLink,
  ShieldCheck,
  LogOut,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { useAdmin, useVlogs, type Vlog, PREMADE_CREDENTIALS } from "@/lib/vlogs";
import { useSolidKapanaligs, type SolidKapanalig } from "@/lib/kapanaligs";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Admin Portal & Creator Hub – AMEN" },
      {
        name: "description",
        content: "Creator dashboard to manage faith vlogs and Solid Kapanaligs.",
      },
      { property: "og:title", content: "Admin Portal – AMEN" },
      { property: "og:description", content: "Creator dashboard for AMEN." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLoginHub,
});

const emptyVlog: Omit<Vlog, "id"> = {
  title: "",
  description: "",
  videoUrl: "",
  imageUrl: "",
  date: new Date().toISOString().slice(0, 10),
};

const emptyKapanalig: Omit<SolidKapanalig, "id"> = {
  rankNumber: 1,
  name: "",
  month: "October 2026",
  avatarUrl: "",
  bio: "",
  badge: "",
};

function AdminLoginHub() {
  const { admin, login, logout } = useAdmin();
  const nav = useNavigate();

  // Mode Switcher: "kapanalig" or "vlog"
  const [activeTab, setActiveTab] = useState<"kapanalig" | "vlog">("kapanalig");

  // Login form state
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vlogs manager hooks
  const { vlogs, add: addVlog, update: updateVlog, remove: removeVlog } = useVlogs();
  const [vlogForm, setVlogForm] = useState<Omit<Vlog, "id">>(emptyVlog);
  const [vlogEditId, setVlogEditId] = useState<string | null>(null);
  const vlogFileInputRef = useRef<HTMLInputElement>(null);

  // Kapanaligs manager hooks
  const {
    kapanaligs,
    add: addKapanalig,
    update: updateKapanalig,
    remove: removeKapanalig,
  } = useSolidKapanaligs();
  const [kapanaligForm, setKapanaligForm] = useState<Omit<SolidKapanalig, "id">>(emptyKapanalig);
  const [kapanaligEditId, setKapanaligEditId] = useState<string | null>(null);
  const kapanaligFileInputRef = useRef<HTMLInputElement>(null);

  // Login submit handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, pw);
      if (!res.success) {
        setLoginError(res.error || "Invalid email or password.");
      }
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillPremade = () => {
    setEmail(PREMADE_CREDENTIALS.email);
    setPw(PREMADE_CREDENTIALS.password);
  };

  // Vlog handlers
  const handleVlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setVlogForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleVlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (vlogEditId) {
      updateVlog({ ...vlogForm, id: vlogEditId });
    } else {
      addVlog(vlogForm);
    }
    setVlogForm(emptyVlog);
    setVlogEditId(null);
    if (vlogFileInputRef.current) vlogFileInputRef.current.value = "";
  };

  const startVlogEdit = (v: Vlog) => {
    setVlogEditId(v.id);
    setVlogForm({
      title: v.title,
      description: v.description,
      videoUrl: v.videoUrl,
      imageUrl: v.imageUrl || "",
      date: v.date,
    });
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  // Kapanalig handlers
  const handleKapanaligImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setKapanaligForm((prev) => ({ ...prev, avatarUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleKapanaligSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kapanaligEditId) {
      updateKapanalig({ ...kapanaligForm, id: kapanaligEditId });
    } else {
      addKapanalig(kapanaligForm);
    }
    setKapanaligForm(emptyKapanalig);
    setKapanaligEditId(null);
    if (kapanaligFileInputRef.current) kapanaligFileInputRef.current.value = "";
  };

  const startKapanaligEdit = (item: SolidKapanalig) => {
    setKapanaligEditId(item.id);
    setKapanaligForm({
      rankNumber: item.rankNumber,
      name: item.name,
      month: item.month,
      avatarUrl: item.avatarUrl || "",
      bio: item.bio || "",
      badge: item.badge || "",
    });
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  // IF NOT LOGGED IN: SHOW LOGIN FORM
  if (!admin) {
    return (
      <div className="min-h-screen bg-heaven flex flex-col justify-between">
        <SiteHeader />
        <div className="px-5 py-16 flex-1 flex items-center justify-center">
          <form
            onSubmit={handleLoginSubmit}
            className="w-full max-w-md space-y-5 rounded-3xl border border-border bg-card p-8 shadow-holy"
          >
            <div className="space-y-1 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-primary mb-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h1 className="font-display text-3xl uppercase text-foreground">Creator Login</h1>
              <p className="text-xs text-muted-foreground">
                Mag-sign in upang magdagdag o mag-ayos ng Vlogs at Solid Kapanaligs.
              </p>
            </div>

            {loginError && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
                {loginError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Email
              </label>
              <input
                required
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-gold"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••••••"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:ring-2 focus:ring-gold"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary py-3.5 font-display text-base uppercase text-primary-foreground shadow-md transition hover:opacity-95 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Login to Admin Hub"}
            </button>

            <div className="pt-2 border-t border-border/70 text-center">
              <button
                type="button"
                onClick={handleFillPremade}
                className="text-xs text-primary underline underline-offset-4 hover:text-primary/80 transition"
              >
                Auto-fill creator credentials ({PREMADE_CREDENTIALS.email})
              </button>
            </div>
          </form>
        </div>
        <SiteFooter />
      </div>
    );
  }

  // IF LOGGED IN: SHOW UNIFIED CREATOR ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <SiteHeader />

      {/* Admin Dashboard Header */}
      <section className="relative overflow-hidden bg-heaven py-12 text-center">
        <div className="rays pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl px-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>AMEN Creator Control Center</span>
            </div>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 text-destructive border border-destructive/20 px-3.5 py-1.5 text-xs font-bold uppercase hover:bg-destructive hover:text-destructive-foreground transition shadow-xs"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>

          <h1 className="mt-3 font-display text-4xl uppercase tracking-tight text-foreground sm:text-5xl">
            Admin Management
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
            Madaling magdagdag ng mga bagong vlogs o itakda ang Top 10 Solid Kapanaligs ng buwan
            (1, 2, 3... may ginto, pilak, at tanso).
          </p>


          {/* 🌟 SWITCH BUTTON: ADD VLOG OR SOLID KAPANALIG 🌟 */}
          <div className="mt-8 mx-auto inline-flex p-1.5 rounded-full bg-card border-2 border-primary/30 shadow-holy">
            <button
              onClick={() => setActiveTab("kapanalig")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm uppercase tracking-wider transition ${
                activeTab === "kapanalig"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>Manage Solid Kapanaligs</span>
              <span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-black text-amber-600 dark:text-amber-300">
                1 2 3...
              </span>
            </button>

            <button
              onClick={() => setActiveTab("vlog")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-display text-sm uppercase tracking-wider transition ${
                activeTab === "vlog"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Video className="h-4 w-4 text-gold" />
              <span>Manage Vlogs</span>
              <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-[10px] font-black">
                {vlogs.length}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* MAIN ADMIN WORKSPACE */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-10">
        {/* ========================================================= */}
        {/* TAB 1: SOLID KAPANALIG MANAGER                            */}
        {/* ========================================================= */}
        {activeTab === "kapanalig" && (
          <div className="space-y-10 animate-fadeIn">
            {/* Form */}
            <form
              onSubmit={handleKapanaligSubmit}
              className="rounded-3xl border-2 border-primary/20 bg-card p-6 sm:p-8 shadow-holy"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4 mb-6">
                <div>
                  <h2 className="font-display text-2xl uppercase text-foreground flex items-center gap-2">
                    <Trophy className="h-6 w-6 text-amber-500" />
                    {kapanaligEditId
                      ? `Edit Solid Kapanalig (#${kapanaligForm.rankNumber})`
                      : "Add New Solid Kapanalig"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Itakda ang puwesto (1 = Ginto 🥇, 2 = Pilak 🥈, 3 = Tanso 🥉) para sa buwan.
                  </p>
                </div>

                {/* Tier Badge Preview */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-bold">Design Tier:</span>
                  {kapanaligForm.rankNumber === 1 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500 px-3.5 py-1 text-xs font-black text-amber-950 shadow-sm animate-pulse">
                      <Crown className="h-3.5 w-3.5" /> 🥇 Rank 1 · Gold Medal
                    </span>
                  )}
                  {kapanaligForm.rankNumber === 2 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-slate-300 via-gray-200 to-slate-400 px-3.5 py-1 text-xs font-black text-slate-800 shadow-sm">
                      <Medal className="h-3.5 w-3.5" /> 🥈 Rank 2 · Silver Medal
                    </span>
                  )}
                  {kapanaligForm.rankNumber === 3 && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-700 via-amber-600 to-orange-700 px-3.5 py-1 text-xs font-black text-white shadow-sm">
                      <Award className="h-3.5 w-3.5" /> 🥉 Rank 3 · Bronze Medal
                    </span>
                  )}
                  {kapanaligForm.rankNumber > 3 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                      ⭐ Rank #{kapanaligForm.rankNumber} (Honorable)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {/* Rank number selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Rank / Number (Pang-ilan) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      required
                      type="number"
                      min={1}
                      max={100}
                      value={kapanaligForm.rankNumber}
                      onChange={(e) =>
                        setKapanaligForm({
                          ...kapanaligForm,
                          rankNumber: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-24 rounded-xl border border-input bg-background px-4 py-2.5 font-display text-lg font-bold text-center text-foreground focus:ring-2 focus:ring-gold"
                    />
                    <div className="flex flex-wrap gap-1">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setKapanaligForm({ ...kapanaligForm, rankNumber: num })}
                          className={`h-9 w-9 rounded-lg text-xs font-bold transition ${
                            kapanaligForm.rankNumber === num
                              ? "bg-primary text-primary-foreground shadow-md scale-105"
                              : "bg-muted/70 hover:bg-muted text-foreground"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Full Name *
                  </label>
                  <input
                    required
                    placeholder="Halimbawa: Bro. Jerome & Sis. Clarisse Dela Cruz"
                    value={kapanaligForm.name}
                    onChange={(e) =>
                      setKapanaligForm({ ...kapanaligForm, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Month */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Edition / Month *
                  </label>
                  <input
                    required
                    placeholder="October 2026"
                    value={kapanaligForm.month}
                    onChange={(e) =>
                      setKapanaligForm({ ...kapanaligForm, month: e.target.value })
                    }
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Title / Badge */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Title / Badge / Role
                  </label>
                  <input
                    placeholder="Halimbawa: Golden Pillar of Faith, Prayer Warrior"
                    value={kapanaligForm.badge}
                    onChange={(e) =>
                      setKapanaligForm({ ...kapanaligForm, badge: e.target.value })
                    }
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Photo upload / URL */}
                <div className="sm:col-span-2 space-y-2 rounded-2xl border border-dashed border-border p-4 bg-muted/20">
                  <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Profile Photo / Avatar
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={kapanaligFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleKapanaligImageUpload}
                    />
                    <button
                      type="button"
                      onClick={() => kapanaligFileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gold-soft transition shadow-xs"
                    >
                      <ImagePlus className="h-4 w-4 text-primary" />
                      <span>{kapanaligForm.avatarUrl ? "Change Photo" : "Upload Photo"}</span>
                    </button>
                    <span className="text-xs text-muted-foreground">or image URL:</span>
                    <input
                      type="url"
                      placeholder="https://example.com/photo.jpg"
                      value={kapanaligForm.avatarUrl || ""}
                      onChange={(e) =>
                        setKapanaligForm({ ...kapanaligForm, avatarUrl: e.target.value })
                      }
                      className="flex-1 min-w-[220px] rounded-xl border border-input bg-background px-4 py-2 text-sm"
                    />
                  </div>

                  {kapanaligForm.avatarUrl && (
                    <div className="relative mt-3 inline-block">
                      <img
                        src={kapanaligForm.avatarUrl}
                        alt="Preview"
                        className="h-20 w-20 rounded-full object-cover border-2 border-gold shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setKapanaligForm({ ...kapanaligForm, avatarUrl: "" });
                          if (kapanaligFileInputRef.current)
                            kapanaligFileInputRef.current.value = "";
                        }}
                        className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow hover:opacity-90"
                        title="Remove image"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bio / dedication */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Dedication / Testimony / Note
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mensahe ng pasasalamat o dahilan ng parangal..."
                    value={kapanaligForm.bio}
                    onChange={(e) =>
                      setKapanaligForm({ ...kapanaligForm, bio: e.target.value })
                    }
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-primary px-8 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground hover:opacity-95 shadow-md transition"
                >
                  {kapanaligEditId ? "Update Kapanalig" : "Add Solid Kapanalig"}
                </button>
                {kapanaligEditId && (
                  <button
                    type="button"
                    onClick={() => {
                      setKapanaligEditId(null);
                      setKapanaligForm(emptyKapanalig);
                      if (kapanaligFileInputRef.current)
                        kapanaligFileInputRef.current.value = "";
                    }}
                    className="rounded-full bg-secondary px-6 py-3 font-display text-sm uppercase tracking-wider text-secondary-foreground hover:opacity-90 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* List of Solid Kapanaligs */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-holy">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-display text-2xl uppercase text-foreground">
                  Current Ranked Solid Kapanaligs ({kapanaligs.length})
                </h3>
                <Link
                  to="/solid-kapanaligs"
                  className="text-xs font-bold text-primary underline underline-offset-4 flex items-center gap-1"
                >
                  View live podium <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {kapanaligs.map((k) => (
                  <div
                    key={k.id}
                    className={`flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 transition ${
                      k.rankNumber === 1
                        ? "border-amber-400 bg-amber-50/40 dark:bg-amber-950/20"
                        : k.rankNumber === 2
                        ? "border-slate-300 bg-slate-50/40 dark:bg-slate-900/20"
                        : k.rankNumber === 3
                        ? "border-amber-600 bg-orange-50/40 dark:bg-orange-950/20"
                        : "border-border bg-background/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-display text-base font-black ${
                          k.rankNumber === 1
                            ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 shadow"
                            : k.rankNumber === 2
                            ? "bg-gradient-to-r from-slate-300 to-gray-200 text-slate-800 shadow"
                            : k.rankNumber === 3
                            ? "bg-gradient-to-r from-amber-700 to-orange-700 text-white shadow"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        #{k.rankNumber}
                      </div>

                      <img
                        src={
                          k.avatarUrl ||
                          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                        }
                        alt={k.name}
                        className="h-11 w-11 rounded-full object-cover border border-border"
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-display text-base uppercase text-foreground">
                            {k.name}
                          </p>
                          {k.rankNumber === 1 && (
                            <span className="text-xs">🥇 Gold</span>
                          )}
                          {k.rankNumber === 2 && (
                            <span className="text-xs">🥈 Silver</span>
                          )}
                          {k.rankNumber === 3 && (
                            <span className="text-xs">🥉 Bronze</span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {k.badge || "Solid Kapanalig"} · {k.month}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startKapanaligEdit(k)}
                        className="rounded-full bg-secondary px-3.5 py-1 text-xs font-bold uppercase hover:bg-secondary/80 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          confirm("Delete this Solid Kapanalig?") && removeKapanalig(k.id)
                        }
                        className="rounded-full bg-destructive/10 text-destructive px-3.5 py-1 text-xs font-bold uppercase hover:bg-destructive hover:text-destructive-foreground transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: VLOGS MANAGER                                      */}
        {/* ========================================================= */}
        {activeTab === "vlog" && (
          <div className="space-y-10 animate-fadeIn">
            <form
              onSubmit={handleVlogSubmit}
              className="rounded-3xl border-2 border-primary/20 bg-card p-6 sm:p-8 shadow-holy"
            >
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
                <div>
                  <h2 className="font-display text-2xl uppercase text-foreground flex items-center gap-2">
                    <Video className="h-6 w-6 text-primary" />
                    {vlogEditId ? "Edit Vlog" : "Add New Vlog"}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    Magbahagi ng video o kwento ng pananampalataya.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Title *
                  </label>
                  <input
                    required
                    placeholder="Pamagat ng vlog"
                    value={vlogForm.title}
                    onChange={(e) => setVlogForm({ ...vlogForm, title: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={vlogForm.date}
                    onChange={(e) => setVlogForm({ ...vlogForm, date: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-gold"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    YouTube URL (Optional)
                  </label>
                  <input
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={vlogForm.videoUrl}
                    onChange={(e) => setVlogForm({ ...vlogForm, videoUrl: e.target.value })}
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-gold"
                  />
                </div>

                {/* Thumbnail upload / URL */}
                <div className="sm:col-span-2 space-y-2 rounded-2xl border border-dashed border-border p-4 bg-muted/20">
                  <label className="block text-xs font-display uppercase tracking-wider text-muted-foreground">
                    Thumbnail Image
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={vlogFileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleVlogImageUpload}
                    />
                    <button
                      type="button"
                      onClick={() => vlogFileInputRef.current?.click()}
                      className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-gold-soft transition shadow-xs"
                    >
                      <ImagePlus className="h-4 w-4 text-primary" />
                      <span>{vlogForm.imageUrl ? "Change Image" : "Upload Image"}</span>
                    </button>
                    <span className="text-xs text-muted-foreground">or image URL:</span>
                    <input
                      type="url"
                      placeholder="https://example.com/thumbnail.jpg"
                      value={vlogForm.imageUrl || ""}
                      onChange={(e) => setVlogForm({ ...vlogForm, imageUrl: e.target.value })}
                      className="flex-1 min-w-[220px] rounded-xl border border-input bg-background px-4 py-2 text-sm"
                    />
                  </div>

                  {vlogForm.imageUrl && (
                    <div className="relative mt-3 inline-block">
                      <img
                        src={vlogForm.imageUrl}
                        alt="Preview"
                        className="h-24 w-40 rounded-xl object-cover border border-border shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setVlogForm({ ...vlogForm, imageUrl: "" });
                          if (vlogFileInputRef.current) vlogFileInputRef.current.value = "";
                        }}
                        className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow hover:opacity-90"
                        title="Remove image"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Maikling paglalarawan ng vlog..."
                    value={vlogForm.description}
                    onChange={(e) =>
                      setVlogForm({ ...vlogForm, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-foreground focus:ring-2 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-primary px-8 py-3 font-display text-sm uppercase tracking-wider text-primary-foreground hover:opacity-95 shadow-md transition"
                >
                  {vlogEditId ? "Update Vlog" : "Post Vlog"}
                </button>
                {vlogEditId && (
                  <button
                    type="button"
                    onClick={() => {
                      setVlogEditId(null);
                      setVlogForm(emptyVlog);
                      if (vlogFileInputRef.current) vlogFileInputRef.current.value = "";
                    }}
                    className="rounded-full bg-secondary px-6 py-3 font-display text-sm uppercase tracking-wider text-secondary-foreground hover:opacity-90 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* List of Vlogs */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-holy">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-display text-2xl uppercase text-foreground">
                  Published Vlogs ({vlogs.length})
                </h3>
                <Link
                  to="/vlogs"
                  className="text-xs font-bold text-primary underline underline-offset-4 flex items-center gap-1"
                >
                  View live page <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="mt-6 space-y-3">
                {vlogs.map((v) => (
                  <div
                    key={v.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-background/50 p-4 transition hover:border-gold"
                  >
                    <div className="flex items-center gap-3">
                      {v.imageUrl ? (
                        <img
                          src={v.imageUrl}
                          alt={v.title}
                          className="h-12 w-20 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="flex h-12 w-20 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Video className="h-5 w-5" />
                        </div>
                      )}

                      <div>
                        <p className="font-display text-base uppercase text-foreground">
                          {v.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{v.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startVlogEdit(v)}
                        className="rounded-full bg-secondary px-3.5 py-1 text-xs font-bold uppercase hover:bg-secondary/80 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirm("Delete this vlog?") && removeVlog(v.id)}
                        className="rounded-full bg-destructive/10 text-destructive px-3.5 py-1 text-xs font-bold uppercase hover:bg-destructive hover:text-destructive-foreground transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
