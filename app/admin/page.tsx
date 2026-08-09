import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { ToastContainer } from "@/components/ui/Toast";

const ICON_GAME = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M12 12h.01M17 12h.01M7 12h.01" />
  </svg>
);

const ICON_NOMINAL = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const ICON_QRIS = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <rect x="14" y="14" width="3" height="3" />
    <path d="M21 14h-4v4" />
  </svg>
);

export default async function AdminDashboard() {
  let gamesCount = 0;
  let pricingCount = 0;
  let activeGames = 0;
  let qrisValue = "";
  let errorMsg = "";

  try {
    const supabase = await createSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: gc } = await (supabase.from("games") as any).select("*", { count: "exact", head: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: pc } = await (supabase.from("pricing") as any).select("*", { count: "exact", head: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { count: ag } = await (supabase.from("games") as any).select("*", { count: "exact", head: true }).eq("is_active", true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: qrisRows } = await (supabase.from("settings") as any).select("value").eq("key", "qris_image_url") as { data: Array<{ value: string }> | null };

    gamesCount = gc ?? 0;
    pricingCount = pc ?? 0;
    activeGames = ag ?? 0;
    qrisValue = qrisRows?.[0]?.value ?? "";
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("relation") && msg.includes("does not exist")) {
      errorMsg = "Tabel belum dibuat. Jalankan SQL schema di Supabase SQL Editor.";
    } else {
      errorMsg = msg;
    }
  }

  const stats = [
    { label: "Game Aktif", value: activeGames, sub: `dari ${gamesCount} total`, icon: ICON_GAME },
    { label: "Total Nominal", value: pricingCount, sub: "harga tersedia", icon: ICON_NOMINAL },
    { label: "QRIS", value: qrisValue ? "✓" : "—", sub: qrisValue ? "terkonfigurasi" : "belum diatur", icon: ICON_QRIS },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-grey">Ringkasan data Lootnexa</p>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          <p className="font-semibold mb-1">Error</p>
          <p>{errorMsg}</p>
          <p className="mt-2 text-grey">Buka Supabase Dashboard → SQL Editor → jalankan isi file <code>supabase/schema.sql</code></p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="hairline rounded-2xl p-5 bg-panel">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[.15em] text-grey">{stat.label}</p>
              <span className="text-line">{stat.icon}</span>
            </div>
            <p className="mt-3 font-display text-2xl font-semibold accent">{stat.value}</p>
            <p className="mt-1 text-[11px] text-grey">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/games"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition btn-primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Kelola Harga
        </Link>
        <Link
          href="/admin/qris"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-ink/70 hover:text-ink bg-paper-2 hover:bg-line border border-line transition"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Kelola QRIS
        </Link>
      </div>

      <ToastContainer />
    </div>
  );
}
