# AI Video Module — Monorepo

Two apps:

- **`apps/server`** — Node/Express backend. Discovers new uploads from a curated
  list of AI YouTube channels (`apps/server/src/channels.ts`) via free RSS feeds,
  enriches them via the YouTube Data API, stores them (JSON file for now — swap
  `src/store.ts` for Postgres/Supabase later), and serves them over a small REST API.
- **`apps/web`** — the Next.js frontend (unchanged UI/components), now fetching
  video data from `apps/server` over HTTP instead of local mock data.
- **`packages/shared`** — the `Video` type + formatters, shared by both apps so
  there's one source of truth for the data shape.

## Setup

```bash
npm install   # installs all workspaces from the root
```

Copy env files and fill them in:

```bash
cp apps/server/.env.example apps/server/.env
```

You'll need a **YouTube Data API key** (Google Cloud Console → enable "YouTube
Data API v3" → Credentials → API key) and a `CRON_SECRET` (any random string,
used to protect the ingest endpoint).

## Running locally

Terminal 1 — start the server:
```bash
npm run dev:server
```

Populate data (run once to start, then let the cron/scheduler repeat it):
```bash
npm run ingest
```

Terminal 2 — start the web app:
```bash
npm run dev:web
```

Visit `http://localhost:3000/videos`.

## Deploying

- **Server**: needs a host with a persistent filesystem for the JSON store
  (a small VM, Railway, Render, Fly.io with a volume) — or swap `apps/server/src/store.ts`
  for a real DB and deploy anywhere, including serverless.
- **Web**: deploys anywhere Next.js runs (Vercel, etc.) — just set `SERVER_URL`
  env var to wherever the server is hosted.
- **Ingestion schedule**: run `npm run ingest -w @video-module/server` on a cron
  (system cron, GitHub Actions scheduled workflow, or your host's scheduler),
  or hit `POST /api/ingest` (with `Authorization: Bearer <CRON_SECRET>`) from
  any external scheduler pointed at the server's URL.
