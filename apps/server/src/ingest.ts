import "dotenv/config";
import { discoverVideos } from "./youtube-search";
import { enrichVideos } from "./youtube-enrich";
import { getKnownYoutubeIds, upsertVideos } from "./store";

/**
 * LLM classification (relevance-gate.ts) is parked for now — free-tier
 * rate limits on Gemini/Groq made iteration painful. Relevance + category
 * are both handled locally via keyword matching in categorize.ts instead.
 * Nothing here needs to change to bring the LLM gate back later — just
 * swap this file for the gate-based version again once you've got a paid
 * key or are OK with it running as a slow background job instead of
 * something you test interactively.
 */
export async function runIngest() {
  // 1. Discovery: open crawl across all of YouTube via keyword search —
  //    no channel whitelist involved.
  const discovered = await discoverVideos();

  const known = await getKnownYoutubeIds();
  const newIds = discovered.map((d) => d.videoId).filter((id) => !known.has(id));

  if (newIds.length === 0) {
    return { discovered: discovered.length, new: 0, total: known.size };
  }

  // 2. Enrichment: full metadata + local keyword categorization/relevance
  //    filtering (see categorize.ts) — no LLM call, no rate limits.
  const enriched = await enrichVideos(newIds);

  // 3. Storage
  const total = await upsertVideos(enriched);

  return {
    discovered: discovered.length,
    new: enriched.length,
    total,
  };
}

if (require.main === module) {
  runIngest()
    .then((result) => {
      console.log("[ingest] done:", result);
      process.exit(0);
    })
    .catch((err) => {
      console.error("[ingest] failed:", err);
      process.exit(1);
    });
}