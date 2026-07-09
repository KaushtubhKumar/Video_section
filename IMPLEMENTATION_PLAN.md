# Crawler + LLM classification — implementation plan

## Goal
Remove the static 14-channel whitelist entirely. Discover AI videos from
anywhere on YouTube via keyword search, then use an LLM (Gemini → Groq
fallback) to reject non-AI noise and assign each surviving video a category.

## Pipeline (old → new)

```
OLD: channels.ts (whitelist) -> rss-fetcher.ts (per-channel RSS)
     -> youtube-enrich.ts (channel category) -> store.ts

NEW: youtube-search.ts (keyword crawl, whole platform)
     -> relevance-gate.ts (LLM: drop non-AI, assign category)
     -> youtube-enrich.ts (full metadata, category from the gate)
     -> store.ts
```

## Files in this drop

| File | Status | What changed |
|---|---|---|
| `apps/server/src/youtube-search.ts` | **new** | Open crawl via `search.list`, keyword-driven, no channel list. Configurable via `YOUTUBE_SEARCH_QUERIES`, `PUBLISHED_AFTER_DAYS`. |
| `apps/server/src/relevance-gate.ts` | **new** | Batches candidates to Gemini; falls back to Groq on failure; fails open (never silently drops data) if both are down. Returns category or `not-ai`. |
| `apps/server/src/youtube-enrich.ts` | **rewritten** | No longer resolves channel handles → channel IDs. Takes `{videoId, toolCategory}` pairs straight from the gate and fetches full metadata. |
| `apps/server/src/ingest.ts` | **rewritten** | Orchestrates discover → snippet fetch → gate → enrich → store. |
| `apps/server/src/store.ts` | **simplified** | Dropped `readChannelIdCache`/`writeChannelIdCache` (no channels to cache anymore). Added `tool_category` column write. |
| `apps/server/src/channels.ts` | **delete** | No longer used anywhere. |
| `apps/server/src/rss-fetcher.ts` | **delete** | No longer used anywhere. |
| `apps/server/.env.example` | **updated** | Added `GEMINI_API_KEY`, `GROQ_API_KEY`, crawler tuning knobs. |
| `apps/server/package.json` | **updated** | Dropped `fast-xml-parser` (RSS parsing is gone). |
| `packages/shared/src/index.ts` | **updated** | Removed `ChannelConfig`/`ChannelCategory`. Added `ToolCategory`, `TOOL_CATEGORIES`, `CATEGORY_LABELS`, `CATEGORY_COLORS`. |
| `apps/web/components/videos/VideoFilters.tsx` | **updated** | Filter chips now read from `TOOL_CATEGORIES`/`CATEGORY_LABELS` (multimodal-ai, llm, agents, robotics, general-ai) instead of an unrelated hardcoded list. |
| `supabase-migration.sql` | **new** | Drops the now-unused `channel_ids` table; adds a `tool_category` column + index for server-side filtering. |
| `apps/server/src/index.ts` | unchanged | `/api/videos`, `/api/videos/:slug`, `/api/ingest` all keep working as-is — `toolCategory` is still just a string field on `Video`. |

## What did NOT change
- `apps/server/src/index.ts` — the Express API surface is untouched.
- Frontend components other than `VideoFilters.tsx` — `VideoCard`, `VideoTable`,
  etc. already just read `video.toolCategory` as a string, so they don't care
  where the value came from.
- `store.ts`'s core video persistence (dedupe by `youtube_id`, upsert logic).

## Steps to apply

1. Copy the new/updated files into your repo at the matching paths.
2. Delete `apps/server/src/channels.ts` and `apps/server/src/rss-fetcher.ts`.
3. `npm uninstall fast-xml-parser -w @video-module/server` (or just let the
   updated `package.json` + `npm install` handle it).
4. Add `GEMINI_API_KEY` and `GROQ_API_KEY` to `apps/server/.env`
   (Gemini: Google AI Studio; Groq: console.groq.com — both have free tiers).
5. Run `supabase-migration.sql` against your Supabase project.
6. `npm run ingest -w @video-module/server` to do a test crawl.
7. Wire `VideoFilters`'s `onChange` into whatever page/shell renders the video
   grid (it wasn't wired to anything yet in the current repo — check
   `apps/web/app/videos/page.tsx` for where filtering happens today).

## Notes / tuning knobs
- **Freshness**: `PUBLISHED_AFTER_DAYS` (default 14) + `order=date` keeps the
  discovery pool recent, same intent as the original blueprint.
- **Cost control**: `YOUTUBE_SEARCH_MAX_PAGES` (default 1 page = 25 results
  per query) and `RELEVANCE_GATE_BATCH_SIZE` (default 15 videos/LLM call)
  bound API usage. Ten default queries × 1 page × 100 units = 1,000 YouTube
  API units per ingest run — well under the 10,000/day free quota.
- **Query rotation**: static list in `youtube-search.ts` by default; override
  anytime with `YOUTUBE_SEARCH_QUERIES="term one|term two|term three"` without
  a code change. LLM-generated rotating queries (asking Gemini for "5 trending
  AI search terms this week") is a natural follow-up but adds an extra LLM
  call per run — left as static per your "simpler and cheaper" preference
  unless you want it wired in next.
- **Fail-open on the gate**: if both Gemini and Groq are unreachable, videos
  pass through tagged `general-ai` rather than being dropped, so a bad LLM day
  doesn't quietly shrink your feed — worth reviewing that data on the next
  healthy run.
