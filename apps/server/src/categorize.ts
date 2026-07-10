import type { ToolCategory } from "@video-module/shared";

/**
 * Keyword-based classification, no LLM call. Cheap stand-in for
 * relevance-gate.ts while that's parked — swap back in later by having
 * ingest.ts call gateVideos() again instead of this.
 *
 * Order matters: first matching category wins, so more specific categories
 * (multimodal-ai, agents, robotics) are checked before the broad llm/
 * general-ai catch-alls.
 */
const CATEGORY_KEYWORDS: { category: ToolCategory; terms: string[] }[] = [
  {
    category: "multimodal-ai",
    terms: [
      "text to image", "text-to-image", "text to video", "text-to-video",
      "image generation", "video generation", "vision language model",
      "vision-language", "multimodal", "any-to-any", "image to video",
      "diffusion model", "midjourney", "stable diffusion", "sora", "veo",
      "flux", "runway", "dall-e", "dalle",
    ],
  },
  {
    category: "robotics",
    terms: ["robot", "robotics", "embodied ai", "humanoid", "boston dynamics"],
  },
  {
    category: "agents",
    terms: [
      "agent", "agentic", "autonomous agent", "multi-agent", "mcp",
      "model context protocol", "tool use", "tool calling", "langchain",
      "langgraph", "workflow automation", "n8n", "crewai", "autogpt",
    ],
  },
  {
    category: "llm",
    terms: [
      "llm", "large language model", "language model", "gpt", "chatgpt",
      "claude", "gemini", "llama", "mistral", "chatbot", "prompt engineering",
      "fine-tun", "fine tun", "rag", "retrieval augmented", "context window",
      "cursor ai", "bolt.new", "lovable",
    ],
  },
];

/** Broad relevance floor: must hit at least one AI-adjacent term at all,
 *  or it's dropped as noise even though it matched a search query
 *  (YouTube's search is loose and sometimes returns unrelated results). */
const AI_FLOOR_TERMS = [
  "ai", "artificial intelligence", "machine learning", "ml", "neural",
  "llm", "gpt", "model", "agent", "robot", ...CATEGORY_KEYWORDS.flatMap((c) => c.terms),
];

function normalize(title: string, description: string): string {
  return `${title} ${description}`.toLowerCase();
}

export function isLikelyAiRelated(title: string, description: string): boolean {
  const text = normalize(title, description);
  return AI_FLOOR_TERMS.some((term) => text.includes(term));
}

export function categorize(title: string, description: string): ToolCategory {
  const text = normalize(title, description);

  for (const { category, terms } of CATEGORY_KEYWORDS) {
    if (terms.some((term) => text.includes(term))) return category;
  }

  return "general-ai";
}