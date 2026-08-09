import { createSupabaseServerClient } from "./supabase-server";
import type { Database } from "@/types/supabase";
import type { DbGame, DbGameWithNominals, DbNominal } from "@/types/game";

export type { DbGame, DbGameWithNominals, DbNominal };

type GameRow = Database["public"]["Tables"]["games"]["Row"];
type PricingRow = Database["public"]["Tables"]["pricing"]["Row"];
type SettingsRow = Database["public"]["Tables"]["settings"]["Row"];

export async function getActiveGames(): Promise<DbGameWithNominals[]> {
  const supabase = await createSupabaseServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: games } = await (supabase.from("games") as any)
    .select("*").eq("is_active", true).order("sort_order") as { data: GameRow[] | null };
  if (!games || games.length === 0) return [];

  const gameIds = games.map((g) => g.id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: allPricing } = await (supabase.from("pricing") as any)
    .select("*").in("game_id", gameIds).order("sort_order") as { data: PricingRow[] | null };

  const pricingByGame = new Map<string, DbNominal[]>();
  (allPricing ?? []).forEach((p) => {
    const list = pricingByGame.get(p.game_id) ?? [];
    list.push(p);
    pricingByGame.set(p.game_id, list);
  });

  return games.map((g) => ({ ...g, nominals: pricingByGame.get(g.id) ?? [] }));
}

export async function getGameBySlug(slug: string): Promise<DbGameWithNominals | null> {
  const supabase = await createSupabaseServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: game } = await (supabase.from("games") as any)
    .select("*").eq("slug", slug).eq("is_active", true).single() as { data: GameRow | null };
  if (!game) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: nominals } = await (supabase.from("pricing") as any)
    .select("*").eq("game_id", game.id).order("sort_order") as { data: PricingRow[] | null };

  return { ...game, nominals: nominals ?? [] };
}

export async function getQrisUrl(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from("settings") as any)
    .select("value").eq("key", "qris_image_url").single() as { data: SettingsRow | null };
  return (data?.value as string) ?? "";
}
