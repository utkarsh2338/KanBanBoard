# KanBan Board

A real-time task management board with animated background.

## Tech Stack

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Socket.io, TypeScript
- **Drag & Drop:** @hello-pangea/dnd

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```
Runs on `http://localhost:3001`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on `http://localhost:3000`

## Features

- Drag and drop tasks between columns
- Add/delete tasks
- Animated triangle particle background
- Three columns: To Do, In Progress, Done

## Structure

```
backend/      - Socket.io server
frontend/     - Next.js app
```

That's it. Open `localhost:3000` and start organizing tasks.
