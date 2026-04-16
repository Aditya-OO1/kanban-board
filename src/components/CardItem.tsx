"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardStatus } from "@/types";
import EditCardModal from "./EditCardModal";
import DeleteConfirmModal from "./DeleteConfirmModal";

const NEXT_STATUS: Record<CardStatus, CardStatus | null> = {
  pending: "in-progress",
  "in-progress": "completed",
  completed: null,
};

const NEXT_LABEL: Record<CardStatus, string | null> = {
  pending: "Move to In Progress",
  "in-progress": "Move to Completed",
  completed: null,
};

interface Props {
  card: Card;
  isDragging?: boolean;
  onMove: (id: string, status: CardStatus) => void;
  onEdit: (id: string, title: string, description: string) => void;
  onDelete: (id: string) => void;
}

export default function CardItem({ card, isDragging, onMove, onEdit, onDelete }: Props) {
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.35 : 1,
  };

  const nextStatus = NEXT_STATUS[card.status];
  const nextLabel = NEXT_LABEL[card.status];

  const formattedDate = new Date(card.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="group relative rounded-lg select-none"
        {...attributes}
      >
        <div
          className="rounded-lg p-3.5 transition-all duration-150"
          style={{
            background: isDragging ? "var(--surface)" : "var(--surface)",
            border: "1px solid var(--border)",
            boxShadow: isDragging
              ? "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)"
              : "0 1px 2px rgba(0,0,0,0.04)",
            cursor: isDragging ? "grabbing" : "grab",
          }}
          {...listeners}
        >
          <div className="flex items-start justify-between gap-2">
            <h3
              className="text-sm font-semibold leading-snug flex-1 min-w-0 truncate"
              style={{ color: "var(--text-primary)" }}
            >
              {card.title}
            </h3>

            <button
              className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
              style={{ color: "var(--text-tertiary)" }}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((v) => !v);
              }}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="2.5" r="1.2" fill="currentColor" />
                <circle cx="7" cy="7" r="1.2" fill="currentColor" />
                <circle cx="7" cy="11.5" r="1.2" fill="currentColor" />
              </svg>
            </button>
          </div>

          {card.description && (
            <p
              className="text-xs mt-1.5 leading-relaxed line-clamp-2"
              style={{ color: "var(--text-secondary)" }}
            >
              {card.description}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              {formattedDate}
            </span>

            {nextStatus && (
              <button
                className="text-xs font-medium px-2 py-1 rounded-md transition-colors duration-150"
                style={{ color: "var(--text-secondary)", background: "var(--surface-2)", border: "1px solid var(--border)" }}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(card.id, nextStatus);
                }}
              >
                → {nextLabel?.replace("Move to ", "")}
              </button>
            )}
          </div>
        </div>

        {menuOpen && (
          <div
            className="absolute right-0 top-8 z-50 rounded-lg py-1 w-40 animate-scale-in"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-50 flex items-center gap-2"
              style={{ color: "var(--text-primary)" }}
              onClick={() => { setShowEdit(true); setMenuOpen(false); }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M9.5 1.5a1.5 1.5 0 012.1 2.1L4.5 10.7l-2.8.7.7-2.8L9.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Edit
            </button>
            {nextStatus && (
              <button
                className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-gray-50 flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
                onClick={() => { onMove(card.id, nextStatus); setMenuOpen(false); }}
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 6.5h9M7.5 3l3.5 3.5L7.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {nextLabel}
              </button>
            )}
            <div style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
            <button
              className="w-full text-left px-3 py-2 text-sm transition-colors hover:bg-red-50 flex items-center gap-2"
              style={{ color: "var(--danger)" }}
              onClick={() => { setShowDelete(true); setMenuOpen(false); }}
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3.5h9M5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M10.5 3.5l-.7 7.5a1 1 0 01-1 .9H4.2a1 1 0 01-1-.9L2.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Delete
            </button>
          </div>
        )}

        {menuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuOpen(false)}
          />
        )}
      </div>

      {showEdit && (
        <EditCardModal
          card={card}
          onClose={() => setShowEdit(false)}
          onSave={(title, description) => {
            onEdit(card.id, title, description);
            setShowEdit(false);
          }}
        />
      )}

      {showDelete && (
        <DeleteConfirmModal
          cardTitle={card.title}
          onClose={() => setShowDelete(false)}
          onConfirm={() => {
            onDelete(card.id);
            setShowDelete(false);
          }}
        />
      )}
    </>
  );
}
