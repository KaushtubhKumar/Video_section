import "dotenv/config";
import { CHANNELS } from "./channels";
import { resolveChannelIds, enrichVideos } from "./youtube-enrich";
import { fetchAllFeeds } from "./rss-fetcher";
import { getKnownYoutubeIds, upsertVideos } from "./store";

export async function runIngest() {
  // 1. Resolve @handle -> channel_id (cached after first run)
  const idCache = await resolveChannelIds(CHANNELS);
  const channelYoutubeIds = CHANNELS.map((c) => idCache[c.id]).filter(Boolean);

  if (channelYoutubeIds.length === 0) {
    throw new Error("No channel IDs resolved — check handles in src/channels.ts");
  }

  // 2. Discover recent uploads across all channels via free RSS feeds (zero API quota)
  const feedEntries = await fetchAllFeeds(channelYoutubeIds);

  // 3. Filter to only videos we haven't already stored
  const known = getKnownYoutubeIds();
  const newEntries = feedEntries.filter((e) => !known.has(e.videoId));

  if (newEntries.length === 0) {
    return { discovered: feedEntries.length, new: 0, total: known.size };
  }

  // 4. Enrich only the new video IDs (batched videos.list calls)
  const channelMeta = CHANNELS.map((c) => ({
    channelYoutubeId: idCache[c.id],
    channelName: c.name,
    category: c.category,
  }));
  const enriched = await enrichVideos(
    newEntries.map((e) => e.videoId),
    channelMeta
  );

  // 5. Upsert into the store
  const total = upsertVideos(enriched);

  return { discovered: feedEntries.length, new: enriched.length, total };
}

// Allows `npm run ingest` to run this file directly (e.g. from a cron job / systemd timer)
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
