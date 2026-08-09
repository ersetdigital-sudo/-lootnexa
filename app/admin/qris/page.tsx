import { createSupabaseServerClient } from "@/lib/supabase-server";
import { QrisManager } from "./QrisManager";

export default async function AdminQrisPage() {
  let currentUrl = "";

  try {
    const supabase = await createSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: setting } = await (supabase.from("settings") as any)
      .select("value")
      .eq("key", "qris_image_url")
      .single();

    if (setting && setting.value) {
      currentUrl = String(setting.value);
    }
  } catch (e) {
    console.error("QRIS fetch error:", e);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-xl font-semibold text-ink">Kelola QRIS</h1>
        <p className="mt-1 text-sm text-grey">Upload dan atur gambar QRIS untuk pembayaran</p>
      </div>

      <div className="max-w-lg">
        <QrisManager currentUrl={currentUrl} />
      </div>
    </div>
  );
}
