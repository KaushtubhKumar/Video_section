import "dotenv/config";
import { discoverVideos } from "./youtube-search";
import { gateVideos } from "./relevance-gate";
import { enrichVideos } from "./youtube-enrich";
import { getKnownYoutubeIds, upsertVideos } from "./store";

export async function runIngest() {
  // 1. Discovery: open crawl across all of YouTube via keyword search —
  //    no channel whitelist involved.
  const discovered = await discoverVideos();

  const known = await getKnownYoutubeIds();
  const newDiscovered = discovered.filter((d) => !known.has(d.videoId));

  if (newDiscovered.length === 0) {
    return { discovered: discovered.length, gated: 0, new: 0, total: known.size };
  }

  // Lightweight metadata pass (title/description only) so the LLM gate has
  // something to classify without a full videos.list call up front.
  const snippetLookup = await fetchSearchSnippets(newDiscovered.map((d) => d.videoId));

  // 2. Gatekeeper: LLM (Gemini -> Groq fallback) rejects non-AI noise and
  //    assigns a category to everything that survives.
  const gated = await gateVideos(snippetLookup);

  if (gated.length === 0) {
    return { discovered: discovered.length, gated: 0, new: 0, total: known.size };
  }

  // 3. Enrichment: full metadata (thumbnail, stats, duration, etc.) for the
  //    videos that passed the gate.
  const enriched = await enrichVideos(gated.map((g) => ({ videoId: g.videoId, toolCategory: g.toolCategory })));

  // 4. Storage
  const total = await upsertVideos(enriched);

  return {
    discovered: discovered.length,
    gated: gated.length,
    new: enriched.length,
    total,
  };
}

/**
 * search.list already returns a title + description snippet per result, but
 * discoverVideos() only keeps videoId/publishedAt to stay lean. Re-fetching
 * here via videos.list (snippet only) keeps the gate's input cheap and
 * avoids duplicating request logic between the two modules.
 */
async function fetchSearchSnippets(
  videoIds: string[]
): Promise<{ videoId: string; title: string; description: string }[]> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");

  const results: { videoId: string; title: string; description: string }[] = [];
  const batches: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    batches.push(videoIds.slice(i, i + 50));
  }

  for (const batch of batches) {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${batch.join(",")}&key=${key}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[ingest] snippet fetch failed: ${res.status}`);
      continue;
    }
    const json = await res.json();
    for (const item of json.items ?? []) {
      results.push({
        videoId: item.id,
        title: item.snippet.title,
        description: item.snippet.description ?? "",
      });
    }
  }

  return results;
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