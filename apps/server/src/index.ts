import "dotenv/config";
import express from "express";
import cors from "cors";
import { readAllVideos } from "./store";
import { runIngest } from "./ingest";

const app = express();
app.use(cors());

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

// GET /api/videos?sort=trending|latest&limit=6
app.get("/api/videos", (req, res) => {
  const videos = readAllVideos();
  const sort = (req.query.sort as string) ?? "latest";
  const limit = req.query.limit ? Number(req.query.limit) : undefined;

  let result = [...videos];
  if (sort === "trending") {
    const cutoff = Date.now() - 60 * 86400000;
    result = result
      .filter((v) => new Date(v.publishedAt).getTime() >= cutoff)
      .sort((a, b) => b.views - a.views);
  } else {
    result = result.sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  if (limit) result = result.slice(0, limit);
  res.json(result);
});

// GET /api/videos/:slug
app.get("/api/videos/:slug", (req, res) => {
  const video = readAllVideos().find((v) => v.slug === req.params.slug);
  if (!video) return res.status(404).json({ error: "Not found" });
  res.json(video);
});

// GET /api/videos/:slug/related?limit=4
app.get("/api/videos/:slug/related", (req, res) => {
  const videos = readAllVideos();
  const video = videos.find((v) => v.slug === req.params.slug);
  if (!video) return res.status(404).json({ error: "Not found" });

  const limit = req.query.limit ? Number(req.query.limit) : 4;
  const related = videos
    .filter((v) => v.id !== video.id && v.toolCategory === video.toolCategory)
    .slice(0, limit)
    .concat(videos.filter((v) => v.id !== video.id && v.toolCategory !== video.toolCategory))
    .slice(0, limit);

  res.json(related);
});

// POST /api/ingest — triggers the RSS discover -> YouTube enrich -> store upsert pipeline.
// Protect with a shared secret so only your own cron can call it.
app.post("/api/ingest", async (req, res) => {
  const auth = req.headers.authorization;
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await runIngest();
    res.json(result);
  } catch (err: any) {
    console.error("[ingest] failed:", err);
    res.status(500).json({ error: err.message ?? "ingest failed" });
  }
});

app.listen(PORT, () => {
  console.log(`[server] listening on http://localhost:${PORT}`);
});
