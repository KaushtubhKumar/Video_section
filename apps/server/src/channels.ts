import type { ChannelConfig } from "@video-module/shared";

/**
 * Curated whitelist — this is the ONLY place YouTube's content enters the system.
 * No keyword search is used anywhere; every video in the feed comes from one of these channels.
 * Add/remove channels here only — no code changes needed elsewhere.
 */
export const CHANNELS: ChannelConfig[] = [
  { id: "openai", handle: "@OpenAI", name: "OpenAI", category: "official-lab" },
  { id: "anthropic", handle: "@anthropic-ai", name: "Anthropic", category: "official-lab" },
  { id: "googledeepmind", handle: "@GoogleDeepMind", name: "Google DeepMind", category: "official-lab" },
  { id: "microsoft-research", handle: "@MicrosoftResearch", name: "Microsoft Research", category: "official-lab" },
  { id: "meta-ai", handle: "@AIatMeta", name: "Meta AI", category: "official-lab" },

  { id: "two-minute-papers", handle: "@TwoMinutePapers", name: "Two Minute Papers", category: "research" },
  { id: "yannic-kilcher", handle: "@YannicKilcher", name: "Yannic Kilcher", category: "research" },
  { id: "andrej-karpathy", handle: "@AndrejKarpathy", name: "Andrej Karpathy", category: "research" },
  { id: "3blue1brown", handle: "@3blue1brown", name: "3Blue1Brown", category: "research" },
  { id: "lex-fridman", handle: "@lexfridman", name: "Lex Fridman", category: "research" },

  { id: "ai-explained", handle: "@aiexplained-official", name: "AI Explained", category: "news" },
  { id: "matthew-berman", handle: "@matthew_berman", name: "Matthew Berman", category: "news" },
  { id: "wes-roth", handle: "@WesRoth", name: "Wes Roth", category: "news" },

  { id: "langchain", handle: "@LangChain", name: "LangChain", category: "tools" },
  { id: "prompt-engineering", handle: "@engineerprompt", name: "Prompt Engineering", category: "tools" },
];
