import type { Video, ToolCategory } from "@video-module/shared";

const API_BASE = "https://www.googleapis.com/youtube/v3";

function apiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
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

/**
 * Turns discovered + LLM-classified video IDs into full metadata records.
 * Unlike the old channel-based version, the source of truth for a video's
 * category is whatever relevance-gate.ts assigned it — not a channel config.
 */
export async function enrichVideos(
  gated: { videoId: string; toolCategory: ToolCategory }[]
): Promise<Video[]> {
  const categoryByVideoId = new Map(gated.map((g) => [g.videoId, g.toolCategory]));
  const videoIds = gated.map((g) => g.videoId);
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
      console.error(`[youtube-enrich] videos.list failed: ${res.status}`);
      continue;
    }
    const json = await res.json();

    for (const item of json.items ?? []) {
      const title: string = item.snippet.title;
      const videoId: string = item.id;
      const toolCategory = categoryByVideoId.get(videoId) ?? "general-ai";

      results.push({
        id: videoId,
        slug: slugify(title, videoId),
        title,
        description: item.snippet.description ?? "",
        toolName: item.snippet.channelTitle,
        toolCategory,
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
        tags: [toolCategory],
        accent: accentFor(videoId),
      });
    }
  }

  return results;
}