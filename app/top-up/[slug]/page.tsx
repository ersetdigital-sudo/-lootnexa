import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getGame } from "@/lib/games";
import { GameOrderForm } from "@/components/GameOrderForm";
import { createSupabaseServerClient } from "@/lib/supabase-server";

function rp(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return { title: "Game tidak ditemukan" };
  return {
    title: game.heading,
    description: `Top up ${game.cur} ${game.name} secara instan di LOOTNEXA. Proses otomatis 24 jam, tanpa login akun, pembayaran QRIS.`,
  };
}

export default async function TopUpPage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  let qrisUrl = "";
  try {
    const supabase = await createSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("settings") as any)
      .select("value").eq("key", "qris_image_url").single();
    if (data?.value) {
      qrisUrl = typeof data.value === "string" ? data.value : String(data.value);
    }
  } catch {}

  const TILE_COLORS: Record<string, string> = {
    "mobile-legends": "#1d2b6b",
    "free-fire": "#8a2b17",
    "pubg-mobile": "#6b5310",
    "call-of-duty-mobile": "#2b2f36",
    "magic-chess-go-go": "#3d2b63",
  };

  return (
    <>
      <header className="sticky top-0 z-[60] border-b border-line bg-paper/90 backdrop-blur-[saturate(1.6)_blur(8px)]">
        <div className="wrap nav-inner h-[66px] flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-[9px] font-display font-extrabold tracking-[-.02em] text-[18px]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="1.2" y="1.2" width="21.6" height="21.6" rx="6.4" stroke="currentColor" strokeWidth="1.7" />
              <path d="M8 6.6v10.8h7.4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
              <circle cx="16.2" cy="8.4" r="1.9" fill="#ff5b26" />
            </svg>
            <span>LOOT<span className="accent">NEXA</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/game" className="text-[14.5px] text-grey hover:text-ink transition-colors">Game</Link>
            <Link href="/#cara" className="text-[14.5px] text-grey hover:text-ink transition-colors">Cara Top Up</Link>
            <Link href="/#aman" className="text-[14.5px] text-grey hover:text-ink transition-colors">Keamanan</Link>
            <Link href="/#faq" className="text-[14.5px] text-grey hover:text-ink transition-colors">FAQ</Link>
          </nav>
          <Link href="/game" className="btn btn-primary btn-sm">Top Up</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="sec pb-6">
          <div className="wrap">
            <nav className="text-[13.5px] text-grey mb-6">
              <Link href="/" className="hover:text-ink">Home</Link>
              <span className="mx-1.5">/</span>
              <Link href="/game" className="hover:text-ink">Game</Link>
              <span className="mx-1.5">/</span>
              <span className="text-ink">{game.name}</span>
            </nav>

            <div className="flex flex-wrap items-center gap-5">
              <div className="tile" style={{ background: TILE_COLORS[game.slug], width: 80, height: 80, fontSize: 16 }}>
                {game.name.split(":")[0].trim()}
              </div>
              <div>
                <p className="text-[12px] uppercase tracking-[.2em] accent">{game.name}</p>
                <h1 className="font-display mt-2 text-[28px] font-extrabold leading-tight sm:text-[38px]">{game.heading}</h1>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed sub">{game.copy}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-[12.5px] sub">
              <span className="card rounded-full px-3.5 py-1.5">{game.cur} · {game.nominals.length} nominal</span>
              <span className="card rounded-full px-3.5 py-1.5">Mulai {rp(game.nominals[0]?.price ?? 0)}</span>
              <span className="card rounded-full px-3.5 py-1.5">Pembayaran QRIS</span>
            </div>
          </div>
        </section>

        <section className="pb-6">
          <div className="wrap">
            <GameOrderForm game={game} qrisUrl={qrisUrl} />
          </div>
        </section>

        <section className="sec">
          <div className="wrap grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <h2 className="font-display text-[24px] font-extrabold sm:text-[32px]">Cara Top Up {game.name}</h2>
              <p className="mt-4 text-[14.5px] leading-relaxed sub">Empat langkah singkat, selesai kurang dari satu menit.</p>
              <ol className="mt-6 space-y-3 text-[13.5px] sub">
                <li><span className="font-semibold text-ink">01.</span> Masukkan data akun {game.name} kamu.</li>
                <li><span className="font-semibold text-ink">02.</span> Pilih nominal {game.cur.split(" / ")[0]} yang diinginkan.</li>
                <li><span className="font-semibold text-ink">03.</span> Periksa ringkasan pesanan dan totalnya.</li>
                <li><span className="font-semibold text-ink">04.</span> Bayar lewat QRIS, item masuk otomatis.</li>
              </ol>
            </div>
            <div>
              <h2 className="font-display text-[24px] font-extrabold sm:text-[32px]">FAQ {game.name}</h2>
              <div className="mt-6">
                <details className="faq border-b border-line">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-5 font-display font-bold text-[15px] sm:text-[16px]">
                    Berapa lama proses top up {game.name}?
                  </summary>
                  <p className="pb-6 text-[14px] leading-relaxed text-grey">Setelah pembayaran QRIS terkonfirmasi, {game.cur} diteruskan otomatis dan umumnya masuk ke akun dalam beberapa detik.</p>
                </details>
                <details className="faq border-b border-line">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-5 font-display font-bold text-[15px] sm:text-[16px]">
                    Data apa yang dibutuhkan untuk top up {game.name}?
                  </summary>
                  <p className="pb-6 text-[14px] leading-relaxed text-grey">Cukup {game.user_id_label}{game.server ? ` dan ${game.serverLabel}` : ""}. LOOTNEXA tidak pernah meminta password, OTP, atau akses login akun game.</p>
                </details>
                <details className="faq border-b border-line">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-5 font-display font-bold text-[15px] sm:text-[16px]">
                    Bagaimana cara membayar?
                  </summary>
                  <p className="pb-6 text-[14px] leading-relaxed text-grey">Pembayaran memakai QRIS, yang bisa dibayar dari hampir semua e-wallet dan m-banking di Indonesia.</p>
                </details>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-ink">
        <div className="wrap py-10">
          <p className="text-[13px] text-center" style={{ color: "#9a9aa4" }}>© 2026 LOOTNEXA. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
