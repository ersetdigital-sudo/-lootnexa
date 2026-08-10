import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { getGame } from "@/lib/games";
import { GameOrderForm } from "@/components/GameOrderForm";
import { getGameBySlug } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import type { DbNominal } from "@/types/game";

function rp(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getDbNominals(slug: string): Promise<DbNominal[]> {
  try {
    const dbGame = await getGameBySlug(slug);
    return dbGame?.nominals ?? [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return { title: "Game tidak ditemukan" };

  const dbNominals = await getDbNominals(slug);
  const regular = dbNominals.filter((n) => n.category !== "pass");
  const minPrice = regular.length > 0 ? Math.min(...regular.map((n) => n.price)) : null;
  const info = minPrice != null ? `Mulai ${rp(minPrice)}` : "Pembayaran QRIS";

  return {
    title: game.heading,
    description: `Top up ${game.cur} ${game.name} secara instan di LOOTNEXA. ${info}. Proses otomatis 24 jam, tanpa login akun.`,
  };
}

export default async function TopUpPage({ params }: PageProps) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();

  const dbNominals = await getDbNominals(slug);
  const dbRegular = dbNominals.filter((n) => n.category !== "pass");
  const dbPasses = dbNominals.filter((n) => n.category === "pass");
  const usesDb = dbNominals.length > 0;

  const regularCount = usesDb ? dbRegular.length : game.nominals.length;
  const minPrice = usesDb && dbRegular.length > 0 ? Math.min(...dbRegular.map((n) => n.price)) : (game.nominals[0]?.price ?? 0);

  let qrisUrl = "";
  let waNumber = "";
  try {
    const supabase = await createSupabaseServerClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from("settings") as any)
      .select("value").eq("key", "qris_image_url").single();
    if (data?.value) {
      qrisUrl = typeof data.value === "string" ? data.value : String(data.value);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: waData } = await (supabase.from("settings") as any)
      .select("value").eq("key", "wa_number").single();
    if (waData?.value) {
      waNumber = typeof waData.value === "string" ? waData.value : String(waData.value);
    }
  } catch {}

  const statChips = [
    { label: "Nominal", value: `${regularCount} pilihan`, bg: "#FFEFE6" },
    { label: "Mulai", value: rp(minPrice), bg: "#FCF7D9" },
    { label: "Kirim", value: game.range, bg: "#FBE4ED" },
    { label: "Bayar", value: "QRIS", bg: "#E0F6F8" },
  ];

  return (
    <>
      <header className="sticky top-4 z-[70] px-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between rounded-full border border-line bg-white/90 px-3 py-2 shadow-sm backdrop-blur-[saturate(1.6)_blur(8px)]">
          <a href="/game" aria-label="Kembali" className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition hover:text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </a>
          <span className="font-display text-[16px] font-bold text-ink">Details</span>
          <a href="/game" aria-label="Semua game" className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink transition hover:text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /></svg>
          </a>
        </div>
      </header>

      <main className="flex-1 pb-44">
        <section className="relative mt-4 overflow-hidden" style={{ background: "linear-gradient(180deg,#FDF7F2 0%,#FFFFFF 65%)" }}>
          <div className="relative h-[300px] sm:h-[380px]">
            <span
              className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 rotate-[-6deg] whitespace-nowrap font-display text-[42px] font-extrabold uppercase tracking-tighter opacity-40 sm:text-[58px]"
              style={{ WebkitTextStroke: "1px rgba(255,123,46,.3)", color: "transparent" }}
            >
              {game.name}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
                <Image
                  src={game.logo}
                  alt={game.alt}
                  width={game.logoWidth}
                  height={game.logoHeight}
                  className="h-auto w-auto max-h-full max-w-full object-contain mix-blend-multiply"
                />
              </div>
            </div>
            <span className="absolute left-4 top-24 -rotate-8 rounded-full border border-line bg-white/90 px-3 py-1.5 text-[11px] font-bold text-ink shadow-md backdrop-blur sm:left-8">
              {game.tag ?? "100% Instan"}
            </span>
            <span className="absolute bottom-28 right-4 rotate-5 rounded-full border border-line bg-white/90 px-3 py-1.5 text-[12px] font-extrabold text-ink shadow-md backdrop-blur sm:right-8">
              Mulai {rp(minPrice)}
            </span>
          </div>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="relative block h-[52px] w-full" style={{ filter: "drop-shadow(0 -4px 8px rgba(0,0,0,.05))" }}>
            <path d="M0 60h1440V0c-180 34-340 48-520 48-220 0-380-28-620-28-160 0-210 22-300 22z" fill="#FFFFFF" />
          </svg>
        </section>

        <section className="relative z-10 -mt-[52px] bg-white px-5 pt-4 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-display text-[22px] font-bold leading-tight text-ink sm:text-[26px]">{game.heading}</h1>
              <div className="shrink-0 text-right">
                <p className="text-[12px] font-medium text-grey">Mulai</p>
                <p className="font-display text-[20px] font-extrabold text-ink">{rp(minPrice)}</p>
              </div>
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-[12px] font-medium text-grey">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-accent"><path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" /></svg>
              {game.cur} · {regularCount} nominal · Pembayaran QRIS
            </p>
            <p className="mt-4 line-clamp-3 text-[13px] leading-relaxed text-grey">{game.copy}</p>
            <h2 className="mt-5 text-[15px] font-bold text-ink">Deskripsi</h2>
            <p className="mt-2 pb-2 text-[13px] leading-relaxed text-grey">
              {game.copy} {game.hint}
            </p>

            <div className="mt-6 grid grid-cols-4 gap-2 pb-2">
              {statChips.map((chip) => (
                <div
                  key={chip.label}
                  className="flex h-[72px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-center shadow-sm"
                  style={{ background: chip.bg }}
                >
                  <span className="text-[9.5px] font-semibold uppercase tracking-wide" style={{ color: "#7A7A7A" }}>{chip.label}</span>
                  <span className="w-full truncate font-display text-[11px] font-bold leading-tight text-ink sm:text-[12.5px]">{chip.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-2 px-5 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <GameOrderForm
              game={game}
              qrisUrl={qrisUrl}
              waNumber={waNumber}
              nominals={usesDb ? dbRegular : undefined}
              passes={usesDb ? dbPasses : undefined}
            />
          </div>
        </section>

        <section className="mt-12 bg-white px-5 sm:px-8">
          <div className="mx-auto max-w-3xl grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-[24px] font-extrabold text-ink sm:text-[28px]">Cara Top Up {game.name}</h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-grey">Empat langkah singkat, selesai kurang dari satu menit.</p>
              <ol className="mt-6 space-y-3 text-[13.5px] text-grey">
                <li><span className="font-semibold text-ink">01.</span> Masukkan data akun {game.name} kamu.</li>
                <li><span className="font-semibold text-ink">02.</span> Pilih nominal {game.cur.split(" / ")[0]} yang diinginkan.</li>
                <li><span className="font-semibold text-ink">03.</span> Periksa ringkasan pesanan dan totalnya.</li>
                <li><span className="font-semibold text-ink">04.</span> Bayar lewat QRIS, item masuk otomatis.</li>
              </ol>
            </div>
            <div>
              <h2 className="font-display text-[24px] font-extrabold text-ink sm:text-[28px]">FAQ {game.name}</h2>
              <div className="mt-6">
                <details className="faq border-b border-line">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-5 font-display font-bold text-[15px] text-ink sm:text-[16px]">
                    Berapa lama proses top up {game.name}?
                  </summary>
                  <p className="pb-6 text-[14px] leading-relaxed text-grey">Setelah pembayaran QRIS terkonfirmasi, {game.cur} diteruskan otomatis dan umumnya masuk ke akun dalam beberapa detik.</p>
                </details>
                <details className="faq border-b border-line">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-5 font-display font-bold text-[15px] text-ink sm:text-[16px]">
                    Data apa yang dibutuhkan untuk top up {game.name}?
                  </summary>
                  <p className="pb-6 text-[14px] leading-relaxed text-grey">Cukup {game.user_id_label}{game.server ? ` dan ${game.serverLabel}` : ""}. LOOTNEXA tidak pernah meminta password, OTP, atau akses login akun game.</p>
                </details>
                <details className="faq border-b border-line">
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-4 py-5 font-display font-bold text-[15px] text-ink sm:text-[16px]">
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
