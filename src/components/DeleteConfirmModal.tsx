"use client";

import { useEffect } from "react";

interface Props {
  cardTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ cardTitle, onClose, onConfirm }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter") onConfirm();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, onConfirm]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 animate-slide-up"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: "var(--danger-light)" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2.5 4.5h13M7 4.5V3a.5.5 0 01.5-.5h3a.5.5 0 01.5.5v1.5M14.5 4.5l-.9 9.5a1 1 0 01-1 .9H5.4a1 1 0 01-1-.9l-.9-9.5" stroke="var(--danger)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
          Delete Card
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Are you sure you want to delete{" "}
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>
            &quot;{cardTitle}&quot;
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--danger)", color: "white" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
