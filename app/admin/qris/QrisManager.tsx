"use client";

import { useState, useRef, useCallback } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { updateQrisImage, updateWaNumber } from "../actions";
import { showToast } from "@/components/ui/Toast";
import { ToastContainer } from "@/components/ui/Toast";

interface QrisManagerProps {
  currentUrl: string;
  waNumber: string;
}

export function QrisManager({ currentUrl, waNumber: initialWaNumber }: QrisManagerProps) {
  const [preview, setPreview] = useState(currentUrl);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadingRef = useRef(false);
  const [waNumber, setWaNumber] = useState(initialWaNumber);
  const [savingWa, setSavingWa] = useState(false);

  const handleSaveWa = async () => {
    const digits = waNumber.replace(/[^0-9]/g, "");
    if (!digits) {
      showToast("error", "Nomor WhatsApp tidak boleh kosong.");
      return;
    }
    setSavingWa(true);
    try {
      const result = await updateWaNumber(digits);
      if (result?.error) {
        showToast("error", "Gagal simpan: " + result.error);
      } else {
        setWaNumber(digits);
        showToast("success", "Nomor WhatsApp disimpan.");
      }
    } catch (e: unknown) {
      showToast("error", "Gagal simpan: " + (e instanceof Error ? e.message : String(e)));
    }
    setSavingWa(false);
  };

  const handleUpload = useCallback(async (file: File) => {
    if (uploadingRef.current) return;
    if (!file.type.startsWith("image/")) {
      showToast("error", "File harus berupa gambar (PNG, JPG, WebP).");
      return;
    }

    uploadingRef.current = true;
    setUploading(true);

    try {
      const result = await uploadToCloudinary(file);
      setPreview(result.secure_url);

      try {
        const saveResult = await updateQrisImage(result.secure_url);
        if (saveResult?.error) {
          showToast("error", "Gagal simpan: " + saveResult.error);
        } else {
          showToast("success", "QRIS berhasil diupdate.");
        }
      } catch (e: unknown) {
        showToast("error", "Gagal simpan: " + (e instanceof Error ? e.message : String(e)));
      }
    } catch (e: unknown) {
      showToast("error", "Gagal upload: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      uploadingRef.current = false;
      setUploading(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <>
      <div>
        <p className="text-[11px] uppercase tracking-[.15em] text-grey mb-3">QRIS Aktif</p>
        <div className="hairline rounded-2xl bg-panel overflow-hidden">
          <div className="p-6 flex justify-center">
            {preview ? (
              <div className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="QRIS aktif"
                  className="max-w-[220px] rounded-xl border border-line"
                />
                <div className="absolute inset-0 rounded-xl bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-xs text-white/60">QRIS aktif</span>
                </div>
              </div>
            ) : (
              <div className="w-[220px] h-[220px] rounded-xl border border-dashed border-line flex items-center justify-center">
                <p className="text-sm text-grey">Belum ada gambar</p>
              </div>
            )}
          </div>

          <div className="px-6 pb-6">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => !uploading && inputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                dragOver
                  ? "border-accent/40 bg-accent/5"
                  : "border-line hover:border-grey"
              }`}
            >
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-sm text-grey">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Mengupload ke Cloudinary…
                </div>
              ) : (
                <>
                  <svg className="mx-auto mb-2 text-grey" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <p className="text-sm text-grey">Klik atau seret gambar ke sini</p>
                  <p className="text-[11px] text-line mt-1">PNG, JPG, atau WebP</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-[11px] uppercase tracking-[.15em] text-grey mb-3">WhatsApp Konfirmasi Pembayaran</p>
        <div className="hairline rounded-2xl bg-panel p-5">
          <p className="text-sm text-grey">Nomor ini dipakai untuk tombol "Konfirmasi Pembayaran" di halaman checkout. Format internasional tanpa tanda + (contoh: 6281234567890).</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
              +62
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="81234567890"
              className="flex-1 min-w-[180px] bg-raise border border-line rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent/40 transition"
            />
            <button
              type="button"
              onClick={handleSaveWa}
              disabled={savingWa}
              className="shrink-0 px-4 py-2.5 text-sm font-bold rounded-lg transition disabled:opacity-50 btn-primary"
            >
              {savingWa ? "Menyimpan…" : "Simpan"}
            </button>
          </div>
          {waNumber && (
            <p className="mt-3 text-[11px] text-emerald-500">
              Aktif: <span className="font-mono">wa.me/{waNumber.replace(/^0/, "62")}</span>
            </p>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <ToastContainer />
    </>
  );
}
