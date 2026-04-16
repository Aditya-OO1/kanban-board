# Kanban Board

A Trello-like Kanban board built with Next.js 15, TypeScript, and Tailwind CSS for managing tasks across workflow stages.

## Features

- **Create, edit, and delete cards** with title and description
- **Three-column workflow** — Pending → In Progress → Completed
- **Drag and drop** reordering and column movement via `@dnd-kit`
- **Quick move buttons** on each card to advance through stages
- **Search and filter** cards across all columns in real time
- **Data persistence** via `localStorage` — cards survive page refreshes
- **Loading skeletons** and empty states for every column
- **Keyboard shortcuts** — `⌘/Ctrl + Enter` to submit modals, `Escape` to close
- **Fully responsive** layout with horizontal scroll on smaller screens

## Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router, Server & Client Components
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [@dnd-kit](https://dndkit.com/) — drag and drop
- [uuid](https://github.com/uuidjs/uuid) — unique card IDs

## Getting Started

### Prerequisites

- Node.js 18.18 or later
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/your-username/kanban-board.git
cd kanban-board
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Global styles and CSS variables
│   ├── layout.tsx        # Root layout (Server Component)
│   └── page.tsx          # Home page (Server Component)
├── components/
│   ├── KanbanBoard.tsx   # Main board with DnD context
│   ├── KanbanColumn.tsx  # Droppable column with sortable list
│   ├── CardItem.tsx      # Draggable card with actions menu
│   ├── CreateCardModal.tsx
│   ├── EditCardModal.tsx
│   ├── DeleteConfirmModal.tsx
│   └── SearchBar.tsx
├── hooks/
│   └── useKanban.ts      # State management and persistence logic
├── lib/
│   └── storage.ts        # localStorage read/write helpers
└── types/
    └── index.ts          # Shared TypeScript types
```

## Architecture Notes

- `page.tsx` and `layout.tsx` are **Server Components** — they handle metadata and static shell rendering
- All interactive components are **Client Components** (`"use client"`) — state, drag-and-drop, and modals
- State is managed locally via `useKanban` custom hook with `localStorage` persistence
- Drag-and-drop is handled by `@dnd-kit/core` with `@dnd-kit/sortable` for within-column reordering

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments on push.
