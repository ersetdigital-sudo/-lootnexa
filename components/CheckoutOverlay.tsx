"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { drawDemoQR } from "@/lib/qr";
import { rupiah } from "@/lib/format";

export interface CheckoutOrder {
  game: string;
  userId: string;
  serverId: string;
  nominalLabel: string;
  price: number;
  total: number;
  orderId: string;
  qrisUrl?: string;
}

interface CheckoutOverlayProps {
  order: CheckoutOrder;
  onClose: () => void;
}

type Step = "pay" | "done";

const DURATION = 300;
const RING_C = 119.4;

export function CheckoutOverlay({ order, onClose }: CheckoutOverlayProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("pay");
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [deliverMsg, setDeliverMsg] = useState("Mengirim item… estimasi < 10 detik");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawDemoQR(canvas, order.orderId);
  }, [order.orderId]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          setStep("done");
          setDeliverMsg("Mengirim item… estimasi < 10 detik");
          window.setTimeout(() => setDeliverMsg("Item sedang diproses. Cek game dalam beberapa detik."), 3200);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (step !== "pay") return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  useEffect(() => {
    if (step === "pay") {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [step]);

  const ringOffset = RING_C * (1 - secondsLeft / DURATION);
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");
  const low = secondsLeft <= 30;

  return (
    <div className="fixed inset-0 z-[120] grid place-items-center p-5" style={{ background: "rgba(13,13,15,.55)" }}>
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-[400px] w-full p-7 text-center border border-line shadow-2xl">
        {step === "pay" && (
          <div>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="text-left">
                <p className="text-[11px] uppercase tracking-[.15em] text-grey">Pembayaran</p>
                <h3 className="font-display text-xl font-bold mt-1">Scan QRIS</h3>
              </div>
              <button type="button" onClick={onClose} className="text-grey hover:text-ink text-xl leading-none">&times;</button>
            </div>

            <div className="flex items-center gap-3 border border-line rounded-2xl px-4 py-3 bg-paper">
              <svg className="timer-ring" viewBox="0 0 44 44"><circle cx="22" cy="22" r="19" stroke="rgba(0,0,0,.09)" /><circle cx="22" cy="22" r="19" stroke={low ? "#f87171" : "#ff5b26"} strokeDasharray={String(RING_C)} strokeDashoffset={String(ringOffset)} /></svg>
              <div className="flex-1 text-left"><p className="text-[11px] text-grey uppercase tracking-[.15em]">Bayar dalam</p><p className={`font-display text-xl font-bold ${low ? "text-red-500" : "accent"}`}>{mm}:{ss}</p></div>
              <span className="flex items-center gap-2 text-[11px] text-[#39e5b6]"><span className="pulse-dot" /> Menunggu</span>
            </div>

            <div className="mt-5 qr-frame">
              <div className="flex items-center gap-2 self-start"><span className="font-display text-[13px] font-bold tracking-tight text-[#0b0b0c]">QRIS</span><span className="text-[9px] text-[#0b0b0c]/50 uppercase tracking-[.18em]">LOOTNEXA</span></div>
              {order.qrisUrl ? (
                <div className="flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={order.qrisUrl} alt="QRIS LOOTNEXA" width={190} height={190} style={{ width: "min(58vw, 190px)", height: "auto", borderRadius: 6, objectFit: "contain" }} />
                </div>
              ) : (
                <div className="flex justify-center">
                  <canvas ref={canvasRef} width={180} height={180} style={{ width: "min(58vw, 190px)", height: "min(58vw, 190px)", imageRendering: "pixelated", borderRadius: 6 }} />
                </div>
              )}
              <p className="text-[10px] text-[#0b0b0c]/55 pb-1 text-center">Satu QR untuk semua e-wallet &amp; m-banking</p>
            </div>

            <div className="mt-5 space-y-2.5 text-sm text-left">
              <div className="flex justify-between"><span className="text-grey">Game</span><span className="font-medium">{order.game}</span></div>
              <div className="flex justify-between"><span className="text-grey">User ID</span><span className="font-medium">{order.userId}</span></div>
              <div className="flex justify-between"><span className="text-grey">Paket</span><span className="font-medium">{order.nominalLabel} · {rupiah(order.price)}</span></div>
              <div className="flex justify-between"><span className="text-grey">Order ID</span><span className="text-grey text-xs font-mono">{order.orderId}</span></div>
              <div className="border-t border-line pt-3 flex justify-between items-center"><span className="text-grey">Total</span><span className="font-display text-xl font-bold accent">{rupiah(order.total)}</span></div>
            </div>

            <button type="button" onClick={onClose} className="w-full text-xs text-grey hover:text-ink transition mt-3">Batalkan pesanan</button>
          </div>
        )}

        {step === "done" && (
          <div className="py-2">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-[rgba(57,229,182,.1)] border border-[rgba(57,229,182,.35)]">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#39e5b6" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
            </div>
            <h3 className="font-display text-2xl font-bold mt-6">Pembayaran berhasil</h3>
            <p className="text-grey text-sm font-light mt-2">Terima kasih! Item sedang dikirim ke akunmu.</p>
            <div className="mt-6 border border-line rounded-2xl p-4 text-left space-y-2.5 text-sm bg-paper">
              <div className="flex justify-between"><span className="text-grey">Order ID</span><span className="text-grey text-xs font-mono">{order.orderId}</span></div>
              <div className="flex justify-between"><span className="text-grey">Game</span><span className="font-medium">{order.game}</span></div>
              <div className="flex justify-between"><span className="text-grey">User ID</span><span className="font-medium">{order.userId}</span></div>
              <div className="flex justify-between"><span className="text-grey">Paket</span><span className="font-medium">{order.nominalLabel}</span></div>
              <div className="border-t border-line pt-2.5 flex justify-between"><span className="text-grey">Dibayar</span><span className="accent font-display font-bold">{rupiah(order.total)}</span></div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#39e5b6]"><span className="pulse-dot" /> {deliverMsg}</div>
            <button type="button" onClick={() => router.push("/")} className="btn btn-primary w-full mt-5">Kembali ke Beranda</button>
          </div>
        )}
      </div>
    </div>
  );
}
