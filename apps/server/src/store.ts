import { createClient } from "@supabase/supabase-js";
import type { Video } from "@video-module/shared";

function client() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_KEY not set");
  return createClient(url, key);
}

export async function readAllVideos(): Promise<Video[]> {
  const { data, error } = await client().from("videos").select("data");
  if (error) {
    console.error("[store] readAllVideos failed:", error.message);
    return [];
  }
  return (data ?? []).map((row: any) => row.data as Video);
}

export async function upsertVideos(incoming: Video[]): Promise<number> {
  if (incoming.length === 0) return (await readAllVideos()).length;

  const rows = incoming.map((v) => ({
    youtube_id: v.youtubeId,
    data: v,
    views: v.views,
    published_at: v.publishedAt,
  }));

  const { error } = await client().from("videos").upsert(rows, { onConflict: "youtube_id" });
  if (error) console.error("[store] upsertVideos failed:", error.message);

  const { count } = await client().from("videos").select("*", { count: "exact", head: true });
  return count ?? incoming.length;
}

export async function getKnownYoutubeIds(): Promise<Set<string>> {
  const { data, error } = await client().from("videos").select("youtube_id");
  if (error) {
    console.error("[store] getKnownYoutubeIds failed:", error.message);
    return new Set();
  }
  return new Set((data ?? []).map((row: any) => row.youtube_id as string));
}

export async function readChannelIdCache(): Promise<Record<string, string>> {
  const { data, error } = await client().from("channel_ids").select("channel_key, youtube_channel_id");
  if (error) {
    console.error("[store] readChannelIdCache failed:", error.message);
    return {};
  }
  const cache: Record<string, string> = {};
  for (const row of data ?? []) cache[row.channel_key] = row.youtube_channel_id;
  return cache;
}

export async function writeChannelIdCache(cache: Record<string, string>): Promise<void> {
  const rows = Object.entries(cache).map(([channel_key, youtube_channel_id]) => ({
    channel_key,
    youtube_channel_id,
  }));
  const { error } = await client().from("channel_ids").upsert(rows, { onConflict: "channel_key" });
  if (error) console.error("[store] writeChannelIdCache failed:", error.message);
}