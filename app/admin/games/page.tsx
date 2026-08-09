import { createSupabaseServerClient } from "@/lib/supabase-server";
import { GamePricingCard } from "./GamePricingCard";
import { ToastContainer } from "@/components/ui/Toast";

export default async function AdminGamesPage() {
  let games: Array<{ id: string; name: string; range_label: string; is_active: boolean }> = [];
  let allPricing: Array<{ id: string; game_id: string; nominal_label: string; price: number; sort_order: number }> = [];
  let errorMsg = "";

  try {
    const supabase = await createSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: gameRows, error: gamesErr } = await (supabase.from("games") as any)
      .select("*").order("sort_order") as { data: any[] | null; error: any }; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (gamesErr) throw gamesErr;

    games = (gameRows ?? []).map((g: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: g.id,
      name: g.name,
      range_label: g.range_label,
      is_active: g.is_active,
    }));

    const gameIds = games.map((g) => g.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: pricingRows } = await (supabase.from("pricing") as any)
      .select("*").in("game_id", gameIds).order("sort_order") as { data: any[] | null }; // eslint-disable-line @typescript-eslint/no-explicit-any

    allPricing = (pricingRows ?? []).map((p: any) => ({ // eslint-disable-line @typescript-eslint/no-explicit-any
      id: p.id,
      game_id: p.game_id,
      nominal_label: p.nominal_label,
      price: p.price,
      sort_order: p.sort_order,
    }));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : typeof e === "object" && e !== null ? JSON.stringify(e) : String(e);
    if (msg.includes("relation") && msg.includes("does not exist")) {
      errorMsg = "Tabel belum dibuat. Jalankan SQL schema di Supabase SQL Editor.";
    } else {
      errorMsg = msg;
    }
  }

  const pricingByGame = new Map<string, typeof allPricing>();
  allPricing.forEach((p) => {
    const list = pricingByGame.get(p.game_id) ?? [];
    list.push(p);
    pricingByGame.set(p.game_id, list);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-ink">Kelola Harga</h1>
        <p className="mt-1 text-sm text-grey">Edit nominal dan harga per game</p>
      </div>

      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          <p className="font-semibold mb-1">Error</p>
          <p>{errorMsg}</p>
          <p className="mt-2 text-grey">Buka Supabase Dashboard → SQL Editor → jalankan isi file <code>supabase/schema.sql</code></p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {games.map((game) => (
          <GamePricingCard
            key={game.id}
            game={game}
            nominals={pricingByGame.get(game.id) ?? []}
          />
        ))}
      </div>

      {games.length === 0 && !errorMsg && (
        <p className="text-sm text-grey text-center py-12">Belum ada game.</p>
      )}

      <ToastContainer />
    </div>
  );
}
