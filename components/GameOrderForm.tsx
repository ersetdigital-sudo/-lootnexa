"use client";

import { useState } from "react";
import { rupiah } from "@/lib/format";
import { CheckoutOverlay } from "@/components/CheckoutOverlay";
import type { Game } from "@/lib/games";
import type { DbNominal } from "@/types/game";

interface GameOrderFormProps {
  game: Game;
  qrisUrl: string;
  waNumber?: string;
  nominals?: DbNominal[];
  passes?: DbNominal[];
}

interface PriceItem {
  label: string;
  price: number;
  badge: string | null;
}

const BADGE_RIBBONS: Record<string, string> = {
  terlaris: "bg-amber-400 text-amber-950",
  best_value: "bg-sky-500 text-white",
  hemat: "bg-emerald-500 text-white",
};

const BADGE_LABELS: Record<string, string> = {
  terlaris: "Terlaris",
  best_value: "Best Value",
  hemat: "Hemat",
};

function PriceButton({
  item,
  selected,
  onClick,
  compact,
}: {
  item: PriceItem;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border bg-white text-left transition overflow-hidden ${
        selected
          ? "border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(255,91,38,.6),0_12px_30px_-18px_rgba(255,91,38,.9)]"
          : "border-line hover:border-accent/50 hover:-translate-y-0.5"
      } ${compact ? "min-h-[38px]" : "min-h-[44px]"}`}
    >
      {item.badge && (
        <span
          className={`flex items-center justify-center gap-1 px-2 py-1 text-[9px] font-bold uppercase tracking-[.12em] leading-none ${
            BADGE_RIBBONS[item.badge] ?? BADGE_RIBBONS.terlaris
          }`}
        >
          {item.badge === "terlaris" && (
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.6h7.6z" />
            </svg>
          )}
          {BADGE_LABELS[item.badge] ?? item.badge}
        </span>
      )}
      <span className={`block ${item.badge ? "px-3 pb-3 pt-2" : "px-3 py-3"}`}>
        <span className="block font-display text-[13px] sm:text-[14.5px] font-bold">{item.label}</span>
        <span className="mt-0.5 block text-[11px] sm:text-[12.5px] text-grey">{rupiah(item.price)}</span>
      </span>
    </button>
  );
}

export function GameOrderForm({ game, qrisUrl, waNumber, nominals, passes }: GameOrderFormProps) {
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [selected, setSelected] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderId, setOrderId] = useState("");

  const listNominals: PriceItem[] = nominals
    ? nominals.map((n) => ({ label: n.nominal_label, price: n.price, badge: n.badge }))
    : game.nominals.map((n) => ({ label: n.label, price: n.price, badge: null }));
  const listPasses: PriceItem[] = passes
    ? passes.map((n) => ({ label: n.nominal_label, price: n.price, badge: n.badge }))
    : [];
  const all = [...listNominals, ...listPasses];
  const hasPasses = listPasses.length > 0;
  const current = all[selected];
  const paymentStep = hasPasses ? "05" : "04";

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
            <p className="text-[12px] text-grey">{listNominals.length} pilihan</p>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {listNominals.map((n, i) => (
              <PriceButton
                key={i}
                item={n}
                selected={selected === i}
                onClick={() => setSelected(i)}
              />
            ))}
          </div>
        </div>

        {hasPasses && (
          <>
            <div className="h-px bg-line my-7" />
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-[15px] font-bold">
                  <span className="mr-2 accent">04</span>Paket Spesial
                </h3>
                <p className="text-[12px] text-grey">{listPasses.length} pilihan</p>
              </div>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {listPasses.map((n, i) => {
                  const idx = listNominals.length + i;
                  return (
                    <PriceButton
                      key={i}
                      item={n}
                      compact
                      selected={selected === idx}
                      onClick={() => setSelected(idx)}
                    />
                  );
                })}
              </div>
              <p className="mt-3 text-[12px] text-grey">Paket spesial &amp; pass tersedia sesuai harga terbaik.</p>
            </div>
          </>
        )}

        <div className="h-px bg-line my-7" />

        <div>
          <h3 className="font-display text-[15px] font-bold">
            <span className={`mr-2 accent`}>{paymentStep}</span>Metode Pembayaran
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
          <div className="flex justify-between gap-4"><dt className="text-grey">Harga</dt><dd className="font-medium text-ink/70">{current ? rupiah(current.price) : "—"}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-grey">Biaya layanan</dt><dd className="font-medium text-ink/70">Rp0</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-grey">Pembayaran</dt><dd className="font-medium text-ink/70">QRIS</dd></div>
        </dl>
        <div className="h-px bg-line my-5" />
        <div className="flex items-end justify-between">
          <p className="text-[13px] text-grey">Total pembayaran</p>
          <p className="font-display text-[26px] font-extrabold">{current ? rupiah(current.price) : "Rp0"}</p>
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
            waNumber,
          }}
          onClose={() => setShowCheckout(false)}
        />
      )}
    </>
  );
}
