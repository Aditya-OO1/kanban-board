"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  onClose: () => void;
  onCreate: (title: string, description: string) => void;
}

export default function CreateCardModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [titleError, setTitleError] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  function handleSubmit() {
    if (!title.trim()) {
      setTitleError(true);
      titleRef.current?.focus();
      return;
    }
    onCreate(title, description);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") onClose();
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 animate-slide-up"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Create Card
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-gray-100"
            style={{ color: "var(--text-tertiary)" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Title <span style={{ color: "var(--danger)" }}>*</span>
            </label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError(false); }}
              placeholder="What needs to be done?"
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all"
              style={{
                background: "var(--surface-2)",
                border: `1px solid ${titleError ? "var(--danger)" : "var(--border)"}`,
                color: "var(--text-primary)",
                boxShadow: titleError ? "0 0 0 3px rgba(239,68,68,0.1)" : "none",
              }}
              onFocus={(e) => (e.target.style.borderColor = titleError ? "var(--danger)" : "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = titleError ? "var(--danger)" : "var(--border)")}
            />
            {titleError && (
              <p className="text-xs mt-1" style={{ color: "var(--danger)" }}>
                Title is required
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all resize-none"
              style={{
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>

        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--accent)", color: "white" }}
          >
            Create Card
          </button>
        </div>

        <p className="text-center text-xs mt-3" style={{ color: "var(--text-tertiary)" }}>
          ⌘ + Enter to create
        </p>
      </div>
    </div>
  );
}
