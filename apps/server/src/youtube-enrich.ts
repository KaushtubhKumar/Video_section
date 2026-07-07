import type { Video } from "@video-module/shared";
import type { ChannelConfig } from "@video-module/shared";
import { readChannelIdCache, writeChannelIdCache } from "./store";

const API_BASE = "https://www.googleapis.com/youtube/v3";

function apiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
}

export async function resolveChannelIds(channels: ChannelConfig[]): Promise<Record<string, string>> {
  const cache = await readChannelIdCache();
  const missing = channels.filter((c) => !cache[c.id]);

  for (const channel of missing) {
    const url = `${API_BASE}/channels?part=id&forHandle=${encodeURIComponent(
      channel.handle
    )}&key=${apiKey()}`;
    const res = await fetch(url);
    const json = await res.json();

    const channelId = json?.items?.[0]?.id;
    if (!channelId) {
      console.error(`[youtube] could not resolve handle ${channel.handle} — check it's correct/still exists`);
      continue;
    }
    cache[channel.id] = channelId;
  }

  if (missing.length > 0) await writeChannelIdCache(cache);
  return cache;
}

function parseIsoDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

function slugify(title: string, videoId: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base}-${videoId.slice(0, 6)}`;
}

const ACCENTS = ["#5e6ad2", "#d85a30", "#1d9e75", "#d4537e", "#378add", "#ba7517", "#639922", "#7f77dd"];
function accentFor(videoId: string) {
  const hash = videoId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ACCENTS[hash % ACCENTS.length];
}

export async function enrichVideos(
  videoIds: string[],
  channelMeta: { channelYoutubeId: string; channelName: string; category: string }[]
): Promise<Video[]> {
  const channelByYoutubeId = new Map(channelMeta.map((c) => [c.channelYoutubeId, c]));
  const results: Video[] = [];

  const batches: string[][] = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    batches.push(videoIds.slice(i, i + 50));
  }

  for (const batch of batches) {
    const url = `${API_BASE}/videos?part=snippet,contentDetails,statistics&id=${batch.join(
      ","
    )}&key=${apiKey()}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`[youtube] videos.list failed: ${res.status}`);
      continue;
    }
    const json = await res.json();

    for (const item of json.items ?? []) {
      const channel = channelByYoutubeId.get(item.snippet.channelId);
      const title: string = item.snippet.title;
      const videoId: string = item.id;

      results.push({
        id: videoId,
        slug: slugify(title, videoId),
        title,
        description: item.snippet.description ?? "",
        toolName: channel?.channelName ?? item.snippet.channelTitle,
        toolCategory: channel?.category ?? "AI",
        youtubeId: videoId,
        thumbnail:
          item.snippet.thumbnails?.maxres?.url ??
          item.snippet.thumbnails?.high?.url ??
          item.snippet.thumbnails?.default?.url,
        durationSeconds: parseIsoDuration(item.contentDetails.duration),
        views: Number(item.statistics?.viewCount ?? 0),
        likes: Number(item.statistics?.likeCount ?? 0),
        publishedAt: item.snippet.publishedAt.slice(0, 10),
        author: { name: item.snippet.channelTitle, avatar: item.snippet.channelTitle.slice(0, 2).toUpperCase() },
        tags: [channel?.category ?? "ai"],
        accent: accentFor(videoId),
      });
    }
  }

  return results;
}