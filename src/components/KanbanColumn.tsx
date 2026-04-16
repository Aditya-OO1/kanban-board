"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardStatus, Column } from "@/types";
import CardItem from "./CardItem";

interface Props {
  column: Column;
  cards: Card[];
  isLoaded: boolean;
  onMove: (id: string, status: CardStatus) => void;
  onEdit: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
}

export default function KanbanColumn({ column, cards, isLoaded, onMove, onEdit, onDelete }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      className="flex flex-col rounded-xl w-80 shrink-0 h-full"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        transition: "box-shadow 0.15s ease",
        boxShadow: isOver ? "0 0 0 2px var(--accent)" : "none",
      }}
    >
      <div
        className="px-4 py-3.5 flex items-center justify-between shrink-0"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${column.dotColor}`} />
          <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            {column.label}
          </span>
        </div>
        <span
          className="text-xs font-medium tabular-nums px-2 py-0.5 rounded-full"
          style={{ background: "var(--surface-2)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
        >
          {cards.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5"
      >
        {!isLoaded ? (
          <SkeletonCards />
        ) : cards.length === 0 ? (
          <EmptyState columnLabel={column.label} />
        ) : (
          <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <CardItem
                key={card.id}
                card={card}
                onMove={onMove}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}

function SkeletonCards() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg p-3.5 animate-pulse"
          style={{ background: "var(--surface-2)", height: 80, opacity: 1 - i * 0.2 }}
        />
      ))}
    </>
  );
}

function EmptyState({ columnLabel }: { columnLabel: string }) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
      <div
        className="w-10 h-10 rounded-xl mb-3 flex items-center justify-center"
        style={{ background: "var(--surface-2)", border: "1px dashed var(--border-strong)" }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
        No {columnLabel.toLowerCase()} cards
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--text-tertiary)" }}>
        Drop cards here or create a new one
      </p>
    </div>
  );
}
