"use client";

import { useState } from "react";
import { CheckoutOverlay } from "@/components/CheckoutOverlay";
import type { Game } from "@/lib/games";

interface GameOrderFormProps {
  game: Game;
  qrisUrl: string;
}

export function GameOrderForm({ game, qrisUrl }: GameOrderFormProps) {
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selectedNominal, setSelectedNominal] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderId, setOrderId] = useState("");

  const nominals = game.nominals || [];
  const current = nominals[selectedNominal];

  const handleCheckout = () => {
    if (!userId.trim() || userId.length < 4) return;
    if (game.server && !serverId.trim()) return;
    setOrderId("LX" + Date.now().toString().slice(-8));
    setShowCheckout(true);
  };

  return (
    <>
      <div className="card rounded-3xl p-5 sm:p-7">
        <div>
          <h3 className="font-display text-[15px] font-bold">
            <span className="mr-2 accent">01</span>Pilih Game
          </h3>
          <div className="mt-4">
            <div className="inline-flex items-center gap-2.5 rounded-2xl border border-accent bg-accent/10 px-3.5 py-2.5 text-[13px] font-semibold">
              <span>{game.name}</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-line my-7" />

        <div>
          <h3 className="font-display text-[15px] font-bold">
            <span className="mr-2 accent">02</span>Data Akun
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[12.5px] text-grey">{game.user_id_label}</label>
              <input
                type="text"
                inputMode="numeric"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={game.user_id_placeholder}
                className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] placeholder:text-grey/50 transition focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              />
            </div>
            {game.server && (
              <div>
                <label className="block text-[12.5px] text-grey">{game.serverLabel}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  placeholder="1000"
                  className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] placeholder:text-grey/50 transition focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
                />
              </div>
            )}
          </div>
          <p className="mt-3 text-[12px] text-grey">{game.hint}</p>
        </div>

        <div className="h-px bg-line my-7" />

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display text-[15px] font-bold">
              <span className="mr-2 accent">03</span>Pilih Nominal
            </h3>
            <p className="text-[12px] text-grey">{nominals.length} pilihan</p>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {nominals.map((n, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedNominal(i)}
                className={`rounded-xl border bg-white px-3 py-3 text-left transition min-h-[44px] ${
                  selectedNominal === i
                    ? "border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(255,91,38,.6),0_12px_30px_-18px_rgba(255,91,38,.9)]"
                    : "border-line hover:border-accent/50 hover:-translate-y-0.5"
                }`}
              >
                <p className="font-display text-[13px] sm:text-[14.5px] font-bold">{n.label}</p>
                <p className="mt-0.5 text-[11px] sm:text-[12.5px] text-grey">{rpiah(n.price)}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-line my-7" />

        <div>
          <h3 className="font-display text-[15px] font-bold">
            <span className="mr-2 accent">04</span>Metode Pembayaran
          </h3>
          <div className="mt-4">
            <div className="flex items-center gap-4 rounded-2xl border border-[#39e5b6] bg-[rgba(57,229,182,.08)] px-4 py-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[rgba(57,229,182,.14)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#39e5b6" strokeWidth="1.8">
                  <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <path d="M14 14h3v3h-3zM19 19h2M19 14h2v2" />
                </svg>
              </span>
              <div>
                <p className="text-[14.5px] font-semibold">QRIS</p>
                <p className="mt-0.5 text-[12px] text-grey">Bisa dibayar dari semua e-wallet &amp; m-banking · tanpa biaya layanan</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[12px] leading-relaxed text-grey">
            LOOTNEXA tidak pernah meminta password, OTP, atau akses login akun game.
          </p>
        </div>
      </div>

      <div className="card rounded-3xl p-5 sm:p-6 lg:sticky lg:top-24">
        <h3 className="font-display text-[15px] font-bold">Ringkasan Pesanan</h3>
        <div className="mt-5 rounded-2xl border border-line bg-white p-3 flex items-center gap-3">
          <div className="h-11 w-11 rounded-lg bg-line/50" />
          <div>
            <p className="text-[14px] font-semibold">{game.name}</p>
            <p className="text-[12px] text-grey">{game.range} {game.cur}</p>
          </div>
        </div>
        <dl className="mt-5 space-y-3 text-[13.5px]">
          <div className="flex justify-between gap-4"><dt className="text-grey">{game.user_id_label}</dt><dd className="font-medium text-ink/70">{userId || "—"}</dd></div>
          {game.server && <div className="flex justify-between gap-4"><dt className="text-grey">{game.serverLabel}</dt><dd className="font-medium text-ink/70">{serverId || "—"}</dd></div>}
          <div className="flex justify-between gap-4"><dt className="text-grey">Nominal</dt><dd className="font-medium text-ink/70">{current?.label || "—"}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-grey">Harga</dt><dd className="font-medium text-ink/70">{current ? rpiah(current.price) : "—"}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-grey">Biaya layanan</dt><dd className="font-medium text-ink/70">Rp0</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-grey">Pembayaran</dt><dd className="font-medium text-ink/70">QRIS</dd></div>
        </dl>
        <div className="h-px bg-line my-5" />
        <div className="flex items-end justify-between">
          <p className="text-[13px] text-grey">Total pembayaran</p>
          <p className="font-display text-[26px] font-extrabold">{current ? rpiah(current.price) : "Rp0"}</p>
        </div>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={!userId || userId.length < 4 || !current}
          className="btn btn-primary mt-6 w-full text-[15px] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Bayar Sekarang
        </button>
        <p className="mt-4 text-[11.5px] leading-relaxed text-grey">Harga yang tercantum sudah final tanpa biaya tambahan.</p>
      </div>

      {showCheckout && current && (
        <CheckoutOverlay
          order={{
            game: game.name,
            userId,
            serverId: game.server ? serverId : "—",
            nominalLabel: current.label,
            price: current.price,
            total: current.price,
            orderId,
            qrisUrl,
          }}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  );
}
