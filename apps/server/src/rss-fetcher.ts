import { XMLParser } from "fast-xml-parser";

export type FeedEntry = {
  videoId: string;
  title: string;
  publishedAt: string; // ISO
  channelYoutubeId: string;
};

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });

/** Every YouTube channel exposes this feed for free, no API key required. */
function feedUrl(channelYoutubeId: string) {
  return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelYoutubeId}`;
}

export async function fetchChannelFeed(channelYoutubeId: string): Promise<FeedEntry[]> {
  const res = await fetch(feedUrl(channelYoutubeId));

  if (!res.ok) {
    console.error(`[rss] failed to fetch feed for ${channelYoutubeId}: ${res.status}`);
    return [];
  }

  const xml = await res.text();
  const parsed = parser.parse(xml);

  const entries = parsed?.feed?.entry;
  if (!entries) return [];

  const list = Array.isArray(entries) ? entries : [entries];

  return list.map((entry: any) => ({
    videoId: entry["yt:videoId"],
    title: entry.title,
    publishedAt: entry.published,
    channelYoutubeId,
  }));
}

/** Fetches all configured channels' feeds in parallel and flattens the result. */
export async function fetchAllFeeds(channelYoutubeIds: string[]): Promise<FeedEntry[]> {
  const results = await Promise.allSettled(channelYoutubeIds.map(fetchChannelFeed));

  const all: FeedEntry[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value);
  }
  return all;
}
