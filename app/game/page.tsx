import Link from "next/link";
import { GAMES } from "@/lib/games";

const TILE_COLORS: Record<string, string> = {
  "mobile-legends": "#1d2b6b",
  "free-fire": "#8a2b17",
  "pubg-mobile": "#6b5310",
  "call-of-duty-mobile": "#2b2f36",
  "magic-chess-go-go": "#3d2b63",
};

export const metadata = {
  title: "Semua Game — Top Up Game di LOOTNEXA",
  description: "Daftar semua game yang tersedia untuk top up di LOOTNEXA: Mobile Legends, Free Fire, PUBG Mobile, COD Mobile, Magic Chess Go Go.",
};

export default function GamePage() {
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
            <Link href="/" className="text-[14.5px] text-grey hover:text-ink transition-colors">Home</Link>
            <Link href="/game" className="text-[14.5px] text-ink font-bold">Game</Link>
            <Link href="/#cara" className="text-[14.5px] text-grey hover:text-ink transition-colors">Cara Top Up</Link>
            <Link href="/#aman" className="text-[14.5px] text-grey hover:text-ink transition-colors">Keamanan</Link>
            <Link href="/#faq" className="text-[14.5px] text-grey hover:text-ink transition-colors">FAQ</Link>
          </nav>
          <Link href="/game" className="btn btn-primary btn-sm">Top Up</Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="sec">
          <div className="wrap">
            <nav className="text-[13.5px] text-grey mb-8">
              <Link href="/" className="hover:text-ink">Home</Link>
              <span className="mx-1.5">/</span>
              <span className="text-ink">Game</span>
            </nav>

            <h1 className="d2 max-w-[16ch]">Semua Game</h1>
            <p className="sub text-[16.5px] mt-4 max-w-[50ch]">Pilih game yang ingin kamu top up. Klik untuk langsung ke halaman order.</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GAMES.map((g) => (
                <Link key={g.slug} href={`/top-up/${g.slug}`} className="card p-5 sm:p-6">
                  <div className="tile" style={{ background: TILE_COLORS[g.slug], height: 80, fontSize: 16, marginBottom: 16 }}>
                    {g.name}
                  </div>
                  <h3 className="font-extrabold text-[18px] tracking-tight">{g.name}</h3>
                  <p className="sub text-[14.5px] mt-1.5">{g.range} {g.cur}</p>
                  <div className="border-t border-line mt-5 pt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11.5px] text-grey">Mulai dari</p>
                      <p className="font-display text-[19px] font-extrabold">
                        Rp{g.nominals[0]?.price.toLocaleString("id-ID") ?? "—"}
                      </p>
                    </div>
                    <span className="btn btn-primary btn-sm">Top Up</span>
                  </div>
                </Link>
              ))}
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
