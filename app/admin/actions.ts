"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function revalidateGame(gameId: string) {
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/games");

  const supabase = await createSupabaseServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: game } = await (supabase.from("games") as any)
    .select("slug")
    .eq("id", gameId)
    .single();
  if (game?.slug) {
    revalidatePath(`/top-up/${game.slug}`);
  }
}

export async function logout() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function addPricing(gameId: string, nominalLabel: string, price: number) {
  const supabase = await createSupabaseServerClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: last } = await (supabase.from("pricing") as any)
    .select("sort_order")
    .eq("game_id", gameId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("pricing") as any).insert({
    game_id: gameId,
    nominal_label: nominalLabel,
    price,
    sort_order: (last?.sort_order ?? 0) + 1,
  });

  if (error) throw error.message;
  await revalidateGame(gameId);
}

export async function updatePricing(id: string, nominalLabel: string, price: number) {
  const supabase = await createSupabaseServerClient();

  // Get game_id before update
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pricing } = await (supabase.from("pricing") as any)
    .select("game_id")
    .eq("id", id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("pricing") as any)
    .update({ nominal_label: nominalLabel, price })
    .eq("id", id);
  if (error) throw error.message;

  if (pricing?.game_id) {
    await revalidateGame(pricing.game_id);
  }
}

export async function deletePricing(id: string) {
  const supabase = await createSupabaseServerClient();

  // Get game_id before delete
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: pricing } = await (supabase.from("pricing") as any)
    .select("game_id")
    .eq("id", id)
    .single();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("pricing") as any).delete().eq("id", id);
  if (error) throw error.message;

  if (pricing?.game_id) {
    await revalidateGame(pricing.game_id);
  }
}

export async function updateGameField(gameId: string, field: string, value: unknown) {
  const supabase = await createSupabaseServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("games") as any)
    .update({ [field]: value })
    .eq("id", gameId);
  if (error) throw error.message;
  await revalidateGame(gameId);
}

export async function updateGameActive(gameId: string, isActive: boolean) {
  const supabase = await createSupabaseServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("games") as any)
    .update({ is_active: isActive })
    .eq("id", gameId);
  if (error) throw error.message;
  await revalidateGame(gameId);
}

export async function updateQrisImage(url: string) {
  const supabase = await createSupabaseServerClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("settings") as any)
    .upsert({ 
      key: "qris_image_url", 
      value: JSON.parse(JSON.stringify(url)),
      updated_at: new Date().toISOString() 
    }, { onConflict: "key" });
  if (error) throw error.message;
  revalidatePath("/admin/qris");
  revalidatePath("/admin");
  revalidatePath("/");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cloudinary: any = null;

async function getCloudinary() {
  if (cloudinary) return cloudinary;
  try {
    const mod = await import("cloudinary");
    cloudinary = mod.v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return cloudinary;
  } catch {
    return null;
  }
}

async function uploadImage(file: File, folder: string): Promise<string> {
  const cld = await getCloudinary();
  if (!cld) throw new Error("Cloudinary tidak dikonfigurasi. Upload icon via URL atau set env CLOUDINARY_CLOUD_NAME.");
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;
  const result = await cld.uploader.upload(dataUrl, { folder, resource_type: "image" });
  return result.secure_url;
}

export async function upsertGame(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = (formData.get("id") as string) || crypto.randomUUID();
  const slug = formData.get("slug") as string;
  const name = formData.get("name") as string;
  const iconFile = formData.get("icon") as File | null;

  const nominals: Array<{ nominal_label: string; price: number }> = [];
  for (let i = 0; i < 50; i++) {
    const label = formData.get(`nominal_label_${i}`) as string | null;
    const price = formData.get(`nominal_price_${i}`) as string | null;
    if (label && price) nominals.push({ nominal_label: label, price: Number(price) });
  }

  let icon_url = formData.get("existing_icon_url") as string || "";
  if (iconFile && iconFile.size > 0) {
    icon_url = await uploadImage(iconFile, "lootnexa/icons");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: gameError } = await (supabase.from("games") as any).upsert({
    id, slug, name, icon_url,
    is_active: formData.get("is_active") === "on",
    sort_order: Number(formData.get("sort_order") || 0),
    user_id_label: formData.get("user_id_label") || "ID Pengguna",
    user_id_placeholder: formData.get("user_id_placeholder") || "12345678",
    server_id_label: formData.get("server_id_label") || "Server ID",
    server_id_placeholder: formData.get("server_id_placeholder") || "1000",
    server_id_required: formData.get("server_id_required") === "on",
    hide_server_id: formData.get("hide_server_id") === "on",
    range_label: formData.get("range_label") || "",
    icon_width: 120, icon_height: 120,
  });
  if (gameError) throw new Error("Gagal simpan game: " + gameError.message);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("pricing") as any).delete().eq("game_id", id);
  if (nominals.length > 0) {
    const rows = nominals.map((n, i) => ({ game_id: id, nominal_label: n.nominal_label, price: n.price, sort_order: i }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: pricingError } = await (supabase.from("pricing") as any).insert(rows);
    if (pricingError) throw new Error("Gagal simpan nominal: " + pricingError.message);
  }

  revalidatePath("/admin/games");
  revalidatePath("/");
  redirect("/admin/games");
}

export async function deleteGame(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const id = formData.get("id") as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("pricing") as any).delete().eq("game_id", id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from("games") as any).delete().eq("id", id);
  revalidatePath("/admin/games");
  revalidatePath("/");
}
