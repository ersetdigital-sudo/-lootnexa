import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="text-center">
        <p className="text-[80px] font-display font-extrabold accent leading-none">404</p>
        <h1 className="mt-4 text-xl font-display font-bold text-ink">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-[15px] sub">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
        <Link href="/" className="btn btn-primary mt-8 inline-block">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
