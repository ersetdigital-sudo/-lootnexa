"use client";

import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabase";
import { LogoMark } from "@/components/ui/LogoMark";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email dan password harus diisi.");
      setLoading(false);
      return;
    }

    try {
      const supabase = createSupabaseClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (authError) {
        if (authError.message.includes("Invalid login credentials")) {
          setError("Email atau password salah.");
        } else if (authError.message.includes("Email not confirmed")) {
          setError("Email belum dikonfirmasi. Cek inbox atau hubungi admin.");
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError("Login gagal. Tidak ada session yang dibuat.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Failed to fetch") || err.message.includes("NetworkError")) {
          setError("Koneksi gagal. Periksa internet dan coba lagi.");
        } else if (err.message.includes("timeout")) {
          setError("Koneksi timeout. Coba lagi dalam beberapa saat.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Terjadi kesalahan tak dikenal. Coba lagi.");
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const supabase = createSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin`,
        },
      });

      if (authError) {
        setError("Google login gagal. Pastikan provider Google sudah diaktifkan di Supabase.");
        setLoading(false);
      }
    } catch {
      setError("Google login gagal. Coba lagi.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-[0.08]" style={{ background: "#ff5b26" }} />
        <div className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-[0.05]" style={{ background: "#ff5b26" }} />
      </div>

      <div className="relative w-full max-w-[1050px] min-h-[700px] rounded-[2.5rem] border border-line bg-white/95 backdrop-blur-sm shadow-2xl overflow-hidden z-10 flex">
        {/* Left panel */}
        <div className="hidden lg:flex w-[56%] relative overflow-hidden rounded-l-[2.5rem]">
          <div className="absolute inset-0" style={{ clipPath: "polygon(0 0, 100% 0, 88% 100%, 0% 100%)" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff5b26]/10 via-[#0d0d0f] to-[#0d0d0f]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-[#0d0d0f]/60" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,91,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,91,38,0.4) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
            <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-15" style={{ background: "#ff5b26" }} />

            <div className="absolute inset-0 flex flex-col justify-between p-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LogoMark className="w-6 h-6" />
                  <span className="font-display font-semibold text-white text-sm">Lootnexa</span>
                </div>
                <div className="flex gap-6 text-[11px] uppercase tracking-[.15em] text-white/60">
                  <span className="text-[#ff5b26]">Admin</span>
                  <span>Panel</span>
                </div>
              </div>

              <div className="flex-1 flex items-center">
                <div>
                  <p className="text-[11px] uppercase tracking-[.3em] text-[#ff5b26] mb-3 font-medium">Dashboard</p>
                  <h2 className="font-display text-4xl font-bold text-white leading-tight">
                    Kelola <span className="accent">Lootnexa</span>
                    <br />
                    Dengan Mudah
                  </h2>
                  <p className="mt-4 text-[15px] text-white/60 leading-relaxed max-w-sm">
                    kelola game, harga, dan pembayaran dalam satu panel terintegrasi.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition cursor-pointer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full lg:w-[44%] flex flex-col items-center justify-center p-8 lg:p-12 relative">
          <div className="w-full max-w-[340px]">
            <div className="mb-8">
              <p className="text-[11px] uppercase tracking-[.3em] text-[#ff5b26] mb-2 font-medium">Admin Panel</p>
              <h1 className="font-display text-2xl font-bold text-ink">
                Hi, <span className="accent">Admin</span>
              </h1>
              <p className="mt-1 text-[15px] text-grey">Welcome to Lootnexa Admin</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full bg-paper border border-line rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-grey outline-none focus:border-accent focus:bg-white transition-all duration-200"
                />
              </div>

              <div>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full bg-paper border border-line rounded-xl px-4 py-3.5 text-sm text-ink placeholder:text-grey outline-none focus:border-accent focus:bg-white transition-all duration-200"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-grey hover:text-accent transition"
                  >
                    Lupa password?
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-3 bg-paper border border-line rounded-xl py-3 text-sm text-ink/70 hover:bg-paper-2 hover:text-ink transition-all duration-200 disabled:opacity-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Login dengan Google
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group btn-primary"
                >
                  <span className="relative">
                    {loading ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Memproses…
                      </span>
                    ) : (
                      "Login"
                    )}
                  </span>
                </button>
              </div>

              <p className="text-center text-[13px] text-grey pt-2">
                Belum punya akses?{" "}
                <span className="text-accent hover:text-[#e94a17] cursor-pointer transition">Hubungi developer</span>
              </p>
            </form>

            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-line">
              {["F", "T", "L", "I"].map((icon, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-paper flex items-center justify-center text-grey hover:text-ink hover:bg-paper-2 border border-line transition cursor-pointer"
                >
                  <span className="text-[10px] font-medium">{icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
