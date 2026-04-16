"use client";

import { useState, useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useKanban } from "@/hooks/useKanban";
import { Card, CardStatus, Column } from "@/types";
import KanbanColumn from "./KanbanColumn";
import CardItem from "./CardItem";
import CreateCardModal from "./CreateCardModal";
import SearchBar from "./SearchBar";

const COLUMNS: Column[] = [
  {
    id: "pending",
    label: "Pending",
    color: "var(--pending-dot)",
    dotColor: "bg-amber-400",
    headerBg: "bg-amber-50",
  },
  {
    id: "in-progress",
    label: "In Progress",
    color: "var(--progress-dot)",
    dotColor: "bg-blue-400",
    headerBg: "bg-blue-50",
  },
  {
    id: "completed",
    label: "Completed",
    color: "var(--completed-dot)",
    dotColor: "bg-emerald-400",
    headerBg: "bg-emerald-50",
  },
];

export default function KanbanBoard() {
  const { cards, isLoaded, addCard, updateCard, moveCard, deleteCard, reorderCards } = useKanban();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCard, setActiveCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return cards;
    const q = searchQuery.toLowerCase();
    return cards.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [cards, searchQuery]);

  const cardsByStatus = useMemo(() => {
    const map: Record<CardStatus, Card[]> = {
      pending: [],
      "in-progress": [],
      completed: [],
    };
    filteredCards.forEach((c) => map[c.status].push(c));
    return map;
  }, [filteredCards]);

  function handleDragStart(event: DragStartEvent) {
    const card = cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCard = cards.find((c) => c.id === activeId);
    if (!activeCard) return;

    const overColumn = COLUMNS.find((col) => col.id === overId);
    if (overColumn && activeCard.status !== overColumn.id) {
      moveCard(activeId, overColumn.id);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeCard = cards.find((c) => c.id === activeId);
    const overCard = cards.find((c) => c.id === overId);

    if (!activeCard) return;

    if (overCard && activeCard.status === overCard.status && activeId !== overId) {
      const statusCards = cards.filter((c) => c.status === activeCard.status);
      const otherCards = cards.filter((c) => c.status !== activeCard.status);
      const oldIndex = statusCards.findIndex((c) => c.id === activeId);
      const newIndex = statusCards.findIndex((c) => c.id === overId);
      const reordered = arrayMove(statusCards, oldIndex, newIndex);
      reorderCards([...otherCards, ...reordered]);
    }
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      <header
        className="shrink-0 px-8 py-5 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="5" height="14" rx="1.5" fill="white" opacity="0.9" />
              <rect x="8" y="1" width="5" height="9" rx="1.5" fill="white" opacity="0.5" />
            </svg>
          </div>
          <h1
            className="text-lg font-semibold tracking-tight"
            style={{ color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif" }}
          >
            Kanban
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 hover:opacity-90 active:scale-95"
            style={{ background: "var(--accent)", color: "white" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Card
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-5 p-6 min-w-max">
            {COLUMNS.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                cards={cardsByStatus[col.id]}
                isLoaded={isLoaded}
                onMove={moveCard}
                onEdit={updateCard}
                onDelete={deleteCard}
              />
            ))}
          </div>
          <DragOverlay>
            {activeCard ? (
              <CardItem
                card={activeCard}
                onMove={moveCard}
                onEdit={updateCard}
                onDelete={deleteCard}
                isDragging
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {isCreateOpen && (
        <CreateCardModal
          onClose={() => setIsCreateOpen(false)}
          onCreate={addCard}
        />
      )}
    </div>
  );
}
