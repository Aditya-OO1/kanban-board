export type CardStatus = "pending" | "in-progress" | "completed";

export interface Card {
  id: string;
  title: string;
  description: string;
  status: CardStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id: CardStatus;
  label: string;
  color: string;
  dotColor: string;
  headerBg: string;
}
