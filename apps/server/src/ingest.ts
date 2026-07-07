import "dotenv/config";
import { CHANNELS } from "./channels";
import { resolveChannelIds, enrichVideos } from "./youtube-enrich";
import { fetchAllFeeds } from "./rss-fetcher";
import { getKnownYoutubeIds, upsertVideos } from "./store";

export async function runIngest() {
  const idCache = await resolveChannelIds(CHANNELS);
  const channelYoutubeIds = CHANNELS.map((c) => idCache[c.id]).filter(Boolean);

  if (channelYoutubeIds.length === 0) {
    throw new Error("No channel IDs resolved — check handles in src/channels.ts");
  }

  const feedEntries = await fetchAllFeeds(channelYoutubeIds);

  const known = await getKnownYoutubeIds();
  const newEntries = feedEntries.filter((e) => !known.has(e.videoId));

  if (newEntries.length === 0) {
    return { discovered: feedEntries.length, new: 0, total: known.size };
  }

  const channelMeta = CHANNELS.map((c) => ({
    channelYoutubeId: idCache[c.id],
    channelName: c.name,
    category: c.category,
  }));
  const enriched = await enrichVideos(
    newEntries.map((e) => e.videoId),
    channelMeta
  );

  const total = await upsertVideos(enriched);

  return { discovered: feedEntries.length, new: enriched.length, total };
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