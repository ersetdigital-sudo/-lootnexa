import Link from "next/link";
import { GAMES } from "@/lib/games";

const LOOTNEXA_LOGO = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="1.2" y="1.2" width="21.6" height="21.6" rx="6.4" stroke="currentColor" strokeWidth="1.7" />
    <path d="M8 6.6v10.8h7.4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
    <circle cx="16.2" cy="8.4" r="1.9" fill="#ff5b26" />
  </svg>
);

const WHY_CARDS = [
  { num: "01", title: "Pilih Game", desc: "Katalog fokus pada lima game populer, jadi kamu langsung menemukan yang dicari." },
  { num: "02", title: "Masukkan ID", desc: "Cukup User ID. Zone ID hanya diperlukan untuk Mobile Legends dan Magic Chess Go Go." },
  { num: "03", title: "Pilih Nominal", desc: "Sembilan pilihan nominal per game, dengan harga yang tampil sejak awal." },
  { num: "04", title: "Bayar", desc: "Ringkasan pesanan tampil sebelum pembayaran, tanpa biaya tambahan tersembunyi." },
];

const HOW_STEPS = [
  { num: "01", title: "Pilih game", desc: "Pilih game yang ingin kamu top up." },
  { num: "02", title: "Masukkan User ID", desc: "Masukkan User ID, dan Zone ID bila diperlukan." },
  { num: "03", title: "Pilih nominal", desc: "Tentukan nominal Diamond, UC, CP, atau Pass." },
  { num: "04", title: "Bayar", desc: "Selesaikan pembayaran, pesanan diproses otomatis." },
];

const FAQS = [
  { q: "Bagaimana cara top up game di LOOTNEXA?", a: "Pilih game, masukkan User ID (dan Zone ID bila diperlukan), pilih nominal, lalu lanjutkan ke pembayaran." },
  { q: "Apakah top up membutuhkan password?", a: "Tidak. LOOTNEXA tidak meminta password, OTP, PIN, maupun akses login ke akun game." },
  { q: "Di mana saya menemukan User ID?", a: "User ID ada di halaman profil dalam game. Buka menu profil atau akun, lalu salin angka ID yang tertera." },
  { q: "Apakah Zone ID diperlukan?", a: "Hanya untuk Mobile Legends dan Magic Chess Go Go. Zone ID ditulis di dalam tanda kurung setelah User ID." },
  { q: "Berapa lama proses top up?", a: "Pesanan diproses otomatis setelah pembayaran terkonfirmasi. Bila ada antrean dari sisi penyedia, prosesnya bisa lebih lama." },
  { q: "Apa yang harus dilakukan jika salah memasukkan User ID?", a: "Hubungi support secepatnya dengan bukti pesanan. Item yang sudah masuk ke ID lain tidak bisa ditarik kembali, jadi pastikan ID benar sebelum bayar." },
  { q: "Apakah pembayaran bisa menggunakan QRIS?", a: "Ya. QRIS termasuk metode yang didukung, bersama e-wallet dan transfer bank." },
  { q: "Game apa saja yang tersedia di LOOTNEXA?", a: "Mobile Legends, Free Fire, PUBG Mobile, Call of Duty Mobile, dan Magic Chess Go Go." },
];

const TILE_COLORS: Record<string, string> = {
  "mobile-legends": "#1d2b6b",
  "free-fire": "#8a2b17",
  "pubg-mobile": "#6b5310",
  "call-of-duty-mobile": "#2b2f36",
  "magic-chess-go-go": "#3d2b63",
};

export default function Home() {
  const featured = GAMES[0];
  const others = GAMES.slice(1);

  return (
    <>
      {/* NAV */}
      <header className="sticky top-0 z-[60] border-b border-line bg-paper/90 backdrop-blur-[saturate(1.6)_blur(8px)]">
        <div className="wrap nav-inner h-[66px] flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-[9px] font-display font-extrabold tracking-[-.02em] text-[18px]">
            {LOOTNEXA_LOGO}
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
        {/* HERO */}
        <section className="hero pt-10 md:pt-16 pb-12 md:pb-16">
          <div className="wrap">
            <span className="pill"><span className="dot"></span>Top up game · Indonesia</span>
            <h1 className="d1 mt-5 max-w-[15ch]">Top Up Game<br />Cepat &amp; Aman.</h1>
            <div className="mt-7 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
              <p className="sub text-[17.5px] max-w-[46ch]">Top up Mobile Legends, Free Fire, PUBG Mobile, COD Mobile, dan Magic Chess Go Go. Pilih game, masukkan User ID, pilih nominal, lalu bayar.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/game" className="btn btn-primary">Top Up Sekarang</Link>
                <Link href="/game" className="btn btn-line hero-btn-line">Lihat Game</Link>
              </div>
            </div>
            <div className="trust">
              <div>Tanpa password</div>
              <div>Tanpa login akun</div>
              <div>Proses otomatis</div>
            </div>
          </div>
        </section>

        {/* CATALOG */}
        <section className="pb-4">
          <div className="wrap">
            <hr className="rule" />
            <div className="flex flex-wrap items-end justify-between gap-4 pt-8 pb-6">
              <h2 className="d2 max-w-[16ch]">Lima Game, Satu Alur Top Up</h2>
              <Link href="/game" className="text-[15px] font-bold accent">Semua game →</Link>
            </div>
            <div className="grid gap-4 md:grid-cols-[1.05fr_1.35fr]">
              {/* Featured: Mobile Legends */}
              <Link href={`/top-up/${featured.slug}`} className="card gcard p-6 md:p-9 flex flex-col justify-between md:row-span-2">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="label">Paling dicari</span>
                    <span className="label">{featured.cur}</span>
                  </div>
                  <div className="tile mt-7" style={{ background: TILE_COLORS[featured.slug], height: 190, fontSize: 34 }}>
                    {featured.name}
                  </div>
                  <h3 className="d3 mt-8">{featured.name}</h3>
                  <p className="sub mt-3 text-[15.5px] max-w-[36ch]">Top up Diamond Mobile Legends dikirim ke User ID dan Zone ID yang kamu masukkan, tanpa login akun.</p>
                </div>
                <span className="btn btn-primary btn-sm mt-8 self-start">Top Up Mobile Legends</span>
              </Link>

              {/* Others */}
              <div className="grid gap-4 content-start">
                {others.map((g) => (
                  <Link key={g.slug} href={`/top-up/${g.slug}`} className="card gcard p-4 sm:p-5 flex items-center gap-4">
                    <div className="tile shrink-0" style={{ background: TILE_COLORS[g.slug], width: 78, height: 60, fontSize: 11, textAlign: "center", padding: "0 6px", lineHeight: 1.25 }}>
                      {g.name.split(":")[0].trim()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-[16.5px] tracking-tight">{g.name}</h3>
                      <p className="sub text-[14px] mt-1">
                        <span className="badge">{g.cur}</span>
                        <br />
                        Top up {g.cur} {g.name} ke User ID kamu.
                      </p>
                    </div>
                    <span className="accent font-bold text-[15px] shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="sec why">
          <div className="wrap">
            <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
              <div>
                <p className="label">Kenapa LOOTNEXA</p>
                <h2 className="d2 mt-5 max-w-[16ch]">Kenapa Top Up di LOOTNEXA</h2>
              </div>
              <p className="sub text-[16.5px] max-w-[40ch] md:justify-self-end">Empat hal yang bikin prosesnya ringkas: katalog fokus, data minimal, harga transparan, pembayaran jelas.</p>
            </div>
            <div className="wgrid mt-10">
              {WHY_CARDS.map((c) => (
                <div key={c.num} className="wcard">
                  <span className="wnum">{c.num}</span>
                  <h3 className="wtitle">{c.title}</h3>
                  <p className="sub text-[15px] mt-2 leading-[1.65]">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO */}
        <section id="cara" className="bg-ink text-paper sec">
          <div className="wrap">
            <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-end">
              <h2 className="d2 max-w-[14ch]">Cara Top Up dalam 4 Langkah</h2>
              <p className="sub text-[16.5px] max-w-[42ch] md:justify-self-end" style={{ color: "#9a9aa4" }}>Alurnya sama untuk semua game, sehingga mudah diikuti setiap kali kamu top up.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-6 mt-10">
              {HOW_STEPS.map((s) => (
                <div key={s.num} className="border-t border-line-dark pt-[18px]">
                  <p className="label" style={{ color: "#9a9aa4" }}>{s.num}</p>
                  <h3 className="text-[19px] font-extrabold mt-3 tracking-tight">{s.title}</h3>
                  <p className="sub text-[15px] mt-2 max-w-[30ch]" style={{ color: "#9a9aa4" }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section id="aman" className="sec">
          <div className="wrap">
            <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-14 items-start">
              <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="1.4" aria-hidden="true">
                <rect x="4" y="10.2" width="16" height="10.4" rx="2.2" />
                <path d="M8.2 10.2V7.6a3.8 3.8 0 0 1 7.6 0v2.6" />
                <circle cx="12" cy="15.4" r="1.2" fill="#ff5b26" stroke="none" />
              </svg>
              <div>
                <h2 className="d2 max-w-[16ch]">Keamanan Akun Kamu Terjaga</h2>
                <p className="sub text-[17px] mt-8 md:mt-10 max-w-[54ch] leading-[1.8]" style={{ marginTop: 20 }}>
                  LOOTNEXA hanya membutuhkan User ID untuk memproses top up. Kami tidak pernah meminta password, OTP, maupun PIN akun game kamu.
                </p>
                <div className="grid sm:grid-cols-3 gap-7 lg:gap-8 mt-11 max-w-[760px]">
                  <div className="border-t border-line pt-[18px]">
                    <p className="font-extrabold text-[16px] tracking-tight">Cukup User ID</p>
                    <p className="sub text-[14.5px] mt-2.5 leading-[1.7]">Data yang diminta hanya yang diperlukan untuk mengirim item.</p>
                  </div>
                  <div className="border-t border-line pt-[18px]">
                    <p className="font-extrabold text-[16px] tracking-tight">Tanpa OTP</p>
                    <p className="sub text-[14.5px] mt-2.5 leading-[1.7]">Kami tidak pernah meminta kode verifikasi apa pun.</p>
                  </div>
                  <div className="border-t border-line pt-[18px]">
                    <p className="font-extrabold text-[16px] tracking-tight">Tanpa login akun</p>
                    <p className="sub text-[14.5px] mt-2.5 leading-[1.7]">Akun game kamu tidak pernah diakses dari sisi kami.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO / EDITORIAL */}
        <section className="sec" style={{ background: "var(--color-paper-2)" }}>
          <div className="wrap grid gap-8 md:gap-12 md:grid-cols-[.85fr_1.15fr]">
            <div>
              <p className="label">Tentang LOOTNEXA</p>
              <h2 className="d2 mt-5 max-w-[13ch]">Tentang Layanan Top Up LOOTNEXA</h2>
            </div>
            <div className="text-[16.5px] leading-[1.8] sub grid gap-4 max-w-[62ch]">
              <p>LOOTNEXA adalah layanan <strong className="text-ink">top up game</strong> untuk pengguna Indonesia. Katalognya dibatasi pada lima judul yang paling banyak dimainkan, jadi kamu tidak perlu mencari-cari menu.</p>
              <h3 className="text-[19px] font-extrabold tracking-tight text-ink">Game yang tersedia</h3>
              <p><strong className="text-ink">Top up Mobile Legends</strong> dan <strong className="text-ink">Magic Chess Go Go</strong> untuk Diamond, <strong className="text-ink">Free Fire</strong> untuk Diamond, <strong className="text-ink">PUBG Mobile</strong> untuk UC, dan <strong className="text-ink">COD Mobile</strong> untuk CP.</p>
              <h3 className="text-[19px] font-extrabold tracking-tight text-ink">Cara kerjanya</h3>
              <p>Alurnya sama di semua game: pilih game, isi User ID, pilih nominal, bayar. Kami hanya butuh ID akun — tanpa password, tanpa OTP, tanpa login ke akun game kamu.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="sec">
          <div className="wrap grid gap-8 md:gap-12 md:grid-cols-[.7fr_1.3fr]">
            <div>
              <p className="label">FAQ</p>
              <h2 className="d2 mt-5 max-w-[10ch]">Pertanyaan yang sering muncul.</h2>
            </div>
            <div>
              <hr className="rule" />
              {FAQS.map((f) => (
                <details key={f.q} className="faq">
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ink">
          <div className="wrap py-16 md:py-24">
            <h2 className="d2 max-w-[14ch]">Siap Top Up Sekarang?</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/game" className="btn btn-primary">Top Up Sekarang</Link>
              <Link href="/game" className="btn border border-white/20 text-paper bg-transparent hover:border-white/40 hover:text-white transition">Lihat Game</Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-ink border-t border-white/[0.08]">
        <div className="wrap py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr_1fr]">
            <div>
              <Link href="/" className="inline-flex items-center gap-[9px] font-display font-extrabold tracking-[-.02em] text-[18px] text-paper">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="1.2" y="1.2" width="21.6" height="21.6" rx="6.4" stroke="white" strokeWidth="1.7" />
                  <path d="M8 6.6v10.8h7.4" stroke="white" strokeWidth="2.4" strokeLinecap="square" />
                  <circle cx="16.2" cy="8.4" r="1.9" fill="#ff5b26" />
                </svg>
                <span>LOOT<span className="accent">NEXA</span></span>
              </Link>
              <p className="text-[14.5px] mt-4 max-w-[34ch]" style={{ color: "#9a9aa4" }}>Platform top up game untuk gamer Indonesia. Lima judul, satu alur, tanpa password.</p>
            </div>
            <div>
              <p className="font-display font-bold text-[13px] uppercase tracking-wider" style={{ color: "#9a9aa4" }}>Game</p>
              <div className="mt-4 grid gap-2.5 text-[14.5px]">
                {GAMES.map((g) => (
                  <Link key={g.slug} href={`/top-up/${g.slug}`} className="hover:text-white transition" style={{ color: "#9a9aa4" }}>{g.name}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="font-display font-bold text-[13px] uppercase tracking-wider" style={{ color: "#9a9aa4" }}>Halaman</p>
              <div className="mt-4 grid gap-2.5 text-[14.5px]">
                <Link href="/game" className="hover:text-white transition" style={{ color: "#9a9aa4" }}>Semua Game</Link>
                <Link href="/#cara" className="hover:text-white transition" style={{ color: "#9a9aa4" }}>Cara Top Up</Link>
                <Link href="/#aman" className="hover:text-white transition" style={{ color: "#9a9aa4" }}>Keamanan</Link>
                <Link href="/#faq" className="hover:text-white transition" style={{ color: "#9a9aa4" }}>FAQ</Link>
              </div>
            </div>
          </div>
          <hr className="my-8 border-white/[0.08]" />
          <div className="flex flex-col md:flex-row gap-3 justify-between text-[13px]" style={{ color: "#9a9aa4" }}>
            <p>© 2026 LOOTNEXA — lootnexa.net</p>
            <p className="max-w-[50ch]">Nama game dan mata uang dalam game adalah milik publisher masing-masing. LOOTNEXA tidak berafiliasi dengan publisher mana pun.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
