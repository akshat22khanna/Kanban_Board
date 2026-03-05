# Real-Time Collaborative Kanban Board

A Trello-like collaborative Kanban board with real-time synchronization, presence indicators, and per-card edit locks. Built with **Next.js**, **WebSockets (Socket.io)**, **Redis Pub/Sub**, and **@dnd-kit** for drag-and-drop.

## Live Demo

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/akshat22khanna/Kanban_Board)

Once deployed, your app will be available at:

`https://kanban-next-app.onrender.com`

> Tip: after deployment, add this URL to your GitHub repo settings under **Settings → General → About → Website** so visitors can easily access the live demo.

## Features

- **Real-time collaboration** – Card movements, edits, and comments sync across all users instantly (<200ms propagation)
- **Optimistic UI** – Instant local updates with server reconciliation; zero perceived lag under normal network conditions
- **Presence indicators** – See who's online (active users with colored avatars)
- **Per-card edit locks** – Redis TTL keys prevent edit conflicts; only one user can edit a card at a time
- **Conflict-free editing** – Edit lock system reduces conflicts to zero in multi-user stress tests

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, @dnd-kit (drag-and-drop), Socket.io Client
- **Backend**: Node.js WebSocket server (Socket.io), Redis Pub/Sub
- **Presence**: Redis TTL keys for online users and edit locks

## Prerequisites

- Node.js 18+
- Redis (local or via Docker)

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Run the app

```bash
npm run dev
```

This starts both:
- **Next.js** on [http://localhost:3500](http://localhost:3500)
- **WebSocket server** on port 3501

**Note:** If Redis is not running, the WebSocket server uses in-memory storage. The app works for local development, but board state is lost on restart.

### 3. (Optional) Start Redis for persistence

From the project folder, run:

```bash
docker compose up -d
```

> If that fails, try `docker-compose up -d` (older Docker Compose V1).

Restart `npm run dev` after Redis is running. Board state will persist across restarts.

## Environment Variables

Copy `.env.example` to `.env.local` and adjust:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_URL` | Next.js app URL (for CORS) | `http://localhost:3500` |
| `NEXT_PUBLIC_WS_URL` | WebSocket server URL | `http://localhost:3501` |
| `WS_PORT` | WebSocket server port | `3501` |
| `REDIS_URL` | Redis connection URL | `redis://localhost:6379` |

## Architecture

```
┌─────────────────┐     WebSocket      ┌──────────────────┐
│   Next.js App   │◄──────────────────►│  WS Server       │
│   (Port 3500)   │                    │  (Port 3501)     │
└─────────────────┘                    └────────┬─────────┘
                                                │
                                                │ Pub/Sub
                                                ▼
                                       ┌──────────────────┐
                                       │      Redis       │
                                       │ - board:state    │
                                       │ - presence:{id}  │
                                       │ - edit:{cardId}  │
                                       └──────────────────┘
```

- **Board state** is stored in Redis (`board:state`) and synced via events
- **Presence** uses Redis TTL keys (`presence:{userId}`) expiring every 30s; heartbeats keep users online
- **Edit locks** use Redis keys (`edit:{cardId}`) with 120s TTL; one user per card

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js + WebSocket server (concurrent) |
| `npm run build` | Build Next.js for production |
| `npm run start` | Run production build + WebSocket server |

## Deployment (Render Blueprint)

The easiest way to deploy is using the **Deploy to Render** button above. This uses the `render.yaml` blueprint to create all necessary services (Next.js app, WebSocket server, and Redis) automatically.

1. Click the **Deploy to Render** button.
2. Connect your GitHub account if prompted.
3. Give the blueprint instance a name (e.g., "kanban-board").
4. Select your workspace (e.g., `tea-d6i48aruibrs73a7n76g`).
5. Click **Apply**.
6. Wait for the build and deployment to complete.
7. Your app will be live at the URL provided by the `kanban-next-app` service.

### Add the live link to GitHub
- `README.md`: replace the **Live Demo** URL with your real Render URL
- GitHub repo → **Settings → General → About** → set **Website** to the same URL

## License

MIT
