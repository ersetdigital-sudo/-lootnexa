"use client";

import { useState } from "react";
import { addPricing, updatePricing, deletePricing, updateGameActive } from "../actions";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Toggle } from "@/components/ui/Toggle";
import { showToast } from "@/components/ui/Toast";

interface PricingItem {
  id: string;
  nominal_label: string;
  price: number;
  category: string;
  badge: string | null;
}

interface GameCardProps {
  game: {
    id: string;
    name: string;
    range_label: string;
    is_active: boolean;
  };
  nominals: PricingItem[];
}

const BADGE_OPTIONS = [
  { value: "", label: "Tanpa badge" },
  { value: "terlaris", label: "Terlaris" },
  { value: "best_value", label: "Best Value" },
  { value: "hemat", label: "Hemat" },
];

const CATEGORY_OPTIONS = [
  { value: "nominal", label: "Nominal" },
  { value: "pass", label: "Paket Spesial" },
];

const BADGE_STYLES: Record<string, string> = {
  terlaris: "bg-amber-500/15 text-amber-600",
  best_value: "bg-sky-500/15 text-sky-600",
  hemat: "bg-emerald-500/15 text-emerald-600",
};

const BADGE_LABELS: Record<string, string> = {
  terlaris: "Terlaris",
  best_value: "Best Value",
  hemat: "Hemat",
};

function BadgeChip({ badge }: { badge: string | null }) {
  if (!badge) return null;
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-none ${BADGE_STYLES[badge] ?? BADGE_STYLES.terlaris}`}
    >
      {badge === "terlaris" && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.6h7.6z" /></svg>
      )}
      {BADGE_LABELS[badge] ?? badge}
    </span>
  );
}

function CategoryChip({ category }: { category: string }) {
  if (category !== "pass") return null;
  return (
    <span className="shrink-0 inline-flex items-center rounded-full bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold leading-none text-violet-600">
      Paket Spesial
    </span>
  );
}

function formatRupiah(value: number): string {
  return "Rp " + value.toLocaleString("id-ID");
}

function parseRupiahInput(input: string): number {
  const cleaned = input.replace(/[^0-9]/g, "");
  return parseInt(cleaned, 10) || 0;
}

function RupiahInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
}) {
  const [display, setDisplay] = useState(value > 0 ? formatRupiah(value) : "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseRupiahInput(e.target.value);
    setDisplay(raw > 0 ? formatRupiah(raw) : "");
    onChange(raw);
  };

  const handleBlur = () => {
    if (value > 0) {
      setDisplay(formatRupiah(value));
    }
  };

  const handleFocus = () => {
    if (value > 0) {
      setDisplay(String(value));
    }
  };

  return (
    <input
      inputMode="numeric"
      value={display}
      onChange={handleChange}
      onBlur={handleBlur}
      onFocus={handleFocus}
      placeholder={placeholder || "Rp 0"}
      className={className}
    />
  );
}

export function GamePricingCard({ game, nominals }: GameCardProps) {
  const [items, setItems] = useState(nominals);
  const [isActive, setIsActive] = useState(game.is_active);
  const [newLabel, setNewLabel] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [newCategory, setNewCategory] = useState("nominal");
  const [newBadge, setNewBadge] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editPrice, setEditPrice] = useState(0);
  const [editCategory, setEditCategory] = useState("nominal");
  const [editBadge, setEditBadge] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PricingItem | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const label = newLabel.trim();

    if (!label) {
      showToast("error", "Label nominal tidak boleh kosong.");
      return;
    }
    if (!newPrice || newPrice <= 0) {
      showToast("error", "Harga harus lebih dari 0.");
      return;
    }

    setLoading(true);
    try {
      await addPricing(game.id, label, newPrice, newCategory, newBadge || null);
      setItems([
        ...items,
        {
          id: "temp-" + Date.now(),
          nominal_label: label,
          price: newPrice,
          category: newCategory,
          badge: newBadge || null,
        },
      ]);
      setNewLabel("");
      setNewPrice(0);
      setNewCategory("nominal");
      setNewBadge("");
      showToast("success", "Nominal berhasil ditambahkan.");
    } catch (err: unknown) {
      showToast("error", "Gagal menambah nominal: " + String(err));
    }
    setLoading(false);
  };

  const handleUpdate = async (id: string) => {
    const label = editLabel.trim();

    if (!label) {
      showToast("error", "Label nominal tidak boleh kosong.");
      return;
    }
    if (!editPrice || editPrice <= 0) {
      showToast("error", "Harga harus lebih dari 0.");
      return;
    }

    setLoading(true);
    try {
      await updatePricing(id, label, editPrice, editCategory, editBadge || null);
      setItems(
        items.map((i) =>
          i.id === id
            ? { ...i, nominal_label: label, price: editPrice, category: editCategory, badge: editBadge || null }
            : i
        )
      );
      setEditing(null);
      showToast("success", "Harga berhasil disimpan.");
    } catch (err: unknown) {
      showToast("error", "Gagal update harga: " + String(err));
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setLoading(true);
    try {
      await deletePricing(deleteTarget.id);
      setItems(items.filter((i) => i.id !== deleteTarget.id));
      showToast("success", "Nominal dihapus.");
    } catch (err: unknown) {
      showToast("error", "Gagal menghapus: " + String(err));
    }
    setDeleteTarget(null);
    setLoading(false);
  };

  const handleToggleActive = async (checked: boolean) => {
    try {
      await updateGameActive(game.id, checked);
      setIsActive(checked);
      showToast("success", checked ? "Game diaktifkan." : "Game dinonaktifkan.");
    } catch (err: unknown) {
      showToast("error", "Gagal update status: " + String(err));
    }
  };

  const inputClass = "bg-raise border border-line rounded-lg px-3 py-2 text-sm text-ink outline-none focus:border-accent/40 transition";

  return (
    <>
      <div className="hairline rounded-2xl bg-panel overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-line">
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold text-ink truncate">{game.name}</h3>
            <p className="text-[11px] text-grey mt-0.5">{game.range_label}</p>
          </div>
          <Toggle
            checked={isActive}
            onChange={handleToggleActive}
            label={isActive ? "Aktif" : "Nonaktif"}
          />
        </div>

        {/* Nominal list */}
        <div className="divide-y divide-line">
          {items.length === 0 && (
            <p className="text-xs text-grey py-6 text-center">Belum ada nominal</p>
          )}
          {items.map((item) => (
            <div key={item.id} className="px-4 sm:px-5 py-3">
              {editing === item.id ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      className={`flex-1 min-w-0 ${inputClass}`}
                    />
                    <RupiahInput
                      value={editPrice}
                      onChange={setEditPrice}
                      className={`w-24 sm:w-28 ${inputClass}`}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className={`flex-1 min-w-0 ${inputClass}`}
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                    <select
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      className={`flex-1 min-w-0 ${inputClass}`}
                    >
                      {BADGE_OPTIONS.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleUpdate(item.id)}
                      disabled={loading}
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25 transition disabled:opacity-50"
                      title="Simpan"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      disabled={loading}
                      className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-paper-2 text-grey hover:text-ink hover:bg-line transition disabled:opacity-50"
                      title="Batal"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0 flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm text-ink/70 truncate">{item.nominal_label}</span>
                    <BadgeChip badge={item.badge} />
                    <CategoryChip category={item.category} />
                  </div>
                  <span className="shrink-0 text-sm text-grey font-mono tabular-nums">
                    {formatRupiah(item.price)}
                  </span>
                  <button
                    onClick={() => {
                      setEditing(item.id);
                      setEditLabel(item.nominal_label);
                      setEditPrice(item.price);
                      setEditCategory(item.category);
                      setEditBadge(item.badge ?? "");
                    }}
                    disabled={loading}
                    className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-paper-2 text-grey hover:text-accent hover:bg-accent/10 transition disabled:opacity-50"
                    title="Edit"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    disabled={loading}
                    className="shrink-0 w-9 h-9 flex items-center justify-center rounded-lg bg-paper-2 text-grey hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                    title="Hapus"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add form */}
        <form onSubmit={handleAdd} className="p-4 border-t border-line flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Label (misal: 60 UC)"
              required
              className={`flex-1 min-w-0 ${inputClass}`}
            />
            <RupiahInput
              value={newPrice}
              onChange={setNewPrice}
              placeholder="Harga"
              className={`w-24 sm:w-28 ${inputClass}`}
            />
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 px-4 py-2.5 text-sm font-semibold rounded-lg transition disabled:opacity-50 btn-primary"
            >
              {loading ? "…" : "Tambah"}
            </button>
          </div>
          <div className="flex gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className={`flex-1 min-w-0 ${inputClass}`}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              className={`flex-1 min-w-0 ${inputClass}`}
            >
              {BADGE_OPTIONS.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
          </div>
        </form>
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Hapus Nominal"
        message={`Yakin mau hapus "${deleteTarget?.nominal_label}"? Tindakan ini gak bisa dibatalkan.`}
        confirmLabel="Ya, Hapus"
        danger
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
