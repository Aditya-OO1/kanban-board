"use client";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
      >
        <circle cx="6" cy="6" r="4.5" stroke="var(--text-tertiary)" strokeWidth="1.4" />
        <path d="M10 10l2.5 2.5" stroke="var(--text-tertiary)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search cards..."
        className="pl-8 pr-3 py-2 rounded-lg text-sm outline-none transition-all w-48"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--accent)";
          e.target.style.width = "220px";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border)";
          e.target.style.width = "192px";
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center"
          style={{ background: "var(--text-tertiary)" }}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1l6 6M7 1L1 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
