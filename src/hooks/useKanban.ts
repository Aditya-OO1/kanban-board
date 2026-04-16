"use client";

import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardStatus } from "@/types";
import { getStoredCards, setStoredCards } from "@/lib/storage";

export function useKanban() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCards(getStoredCards());
    setIsLoaded(true);
  }, []);

  const persist = useCallback((updated: Card[]) => {
    setCards(updated);
    setStoredCards(updated);
  }, []);

  const addCard = useCallback(
    (title: string, description: string) => {
      const newCard: Card = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      persist([...cards, newCard]);
    },
    [cards, persist]
  );

  const updateCard = useCallback(
    (id: string, title: string, description: string) => {
      persist(
        cards.map((c) =>
          c.id === id
            ? { ...c, title: title.trim(), description: description.trim(), updatedAt: new Date().toISOString() }
            : c
        )
      );
    },
    [cards, persist]
  );

  const moveCard = useCallback(
    (id: string, status: CardStatus) => {
      persist(
        cards.map((c) =>
          c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
        )
      );
    },
    [cards, persist]
  );

  const deleteCard = useCallback(
    (id: string) => {
      persist(cards.filter((c) => c.id !== id));
    },
    [cards, persist]
  );

  const reorderCards = useCallback(
    (reordered: Card[]) => {
      persist(reordered);
    },
    [persist]
  );

  return { cards, isLoaded, addCard, updateCard, moveCard, deleteCard, reorderCards };
}
