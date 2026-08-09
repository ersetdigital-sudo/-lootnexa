"use client";

import { useEffect, useState } from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error";
  message: string;
}

let toastListeners: ((toast: ToastMessage) => void)[] = [];

export function showToast(type: "success" | "error", message: string) {
  const toast: ToastMessage = { id: Date.now().toString(), type, message };
  toastListeners.forEach((fn) => fn(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (toast: ToastMessage) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), 3000);
    };
    toastListeners.push(handler);
    return () => { toastListeners = toastListeners.filter((fn) => fn !== handler); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm text-sm font-medium ${
            toast.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-600"
              : "bg-red-50 border border-red-200 text-red-500"
          }`}
        >
          {toast.type === "success" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
          )}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
