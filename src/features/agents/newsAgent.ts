/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Tech News Worker Agent — powered via OpenRouter
 * Fetches RSS feeds from major AI/tech sources and summarizes the top stories.
 */
import Parser from "rss-parser";
import { getOpenRouterClient, OPENROUTER_MODELS } from "./openrouter";
import { AgentResult, NewsItem } from "./types";

const RSS_FEEDS = [
  { name: "Anthropic", url: "https://www.anthropic.com/rss.xml" },
  { name: "OpenAI", url: "https://openai.com/blog/rss.xml" },
  { name: "Google AI", url: "https://blog.google/technology/ai/rss/" },
  { name: "HackerNews AI", url: "https://hnrss.org/newest?q=AI+LLM+Claude+GPT&count=15" },
  { name: "TechCrunch AI", url: "https://techcrunch.com/category/artificial-intelligence/feed/" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/category/ai/feed/" },
];

interface RawArticle {
  title: string;
  link: string;
  source: string;
  pubDate: string;
  contentSnippet: string;
}

async function fetchFeed(
  parser: Parser,
  feed: { name: string; url: string }
): Promise<RawArticle[]> {
  try {
    const result = await Promise.race([
      parser.parseURL(feed.url),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), 5000)
      ),
    ]);

    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    return result.items
      .filter((item) => {
        const pub = item.pubDate ? new Date(item.pubDate).getTime() : Date.now();
        return pub > oneDayAgo;
      })
      .slice(0, 5)
      .map((item) => ({
        title: item.title || "Untitled",
        link: item.link || "",
        source: feed.name,
        pubDate: item.pubDate || new Date().toISOString(),
        contentSnippet: (item.contentSnippet || item.summary || "").slice(0, 300),
      }));
  } catch {
    console.warn(`[NewsAgent] Failed to fetch ${feed.name}`);
    return [];
  }
}

export async function runNewsAgent(): Promise<AgentResult<NewsItem[]>> {
  console.log("[NewsAgent] Starting...");
  const startTime = Date.now();

  try {
    const parser = new Parser({ timeout: 5000 });

    // Fetch all feeds in parallel
    const feedResults = await Promise.all(
      RSS_FEEDS.map((feed) => fetchFeed(parser, feed))
    );

    const allArticles = feedResults.flat();
    console.log(`[NewsAgent] Collected ${allArticles.length} articles`);

    if (allArticles.length === 0) {
      return { success: false, error: "No articles collected from RSS feeds" };
    }

    // Use OpenRouter to pick and summarize top stories
    const client = getOpenRouterClient();

    const articlesText = allArticles
      .map(
        (a, i) =>
          `[${i + 1}] Source: ${a.source}\nTitle: ${a.title}\nURL: ${a.link}\nDate: ${a.pubDate}\nSnippet: ${a.contentSnippet}`
      )
      .join("\n\n---\n\n");

    const prompt = `You are a tech news curator for a senior Vietnamese developer. Analyze these articles from the last 24 hours and select the TOP 5 most important/impactful ones in the AI/tech space.

ARTICLES:
${articlesText}

Respond in JSON format ONLY (no markdown, no explanation). The "title" and "summary" fields MUST be written in natural, easy-to-understand Vietnamese (tiếng Việt tự nhiên, dễ hiểu, không dịch máy):
{
  "highlights": [
    {
      "title": "Dịch tiêu đề bài báo sang tiếng Việt tự nhiên, dễ hiểu (giữ nguyên tên riêng: công ty, sản phẩm, tên người)",
      "source": "source name",
      "url": "article url",
      "summary": "Tóm tắt 2 câu bằng tiếng Việt, giải thích ngắn gọn vì sao tin này quan trọng với một developer",
      "publishedAt": "ISO date string"
    }
  ]
}`;

    const completion = await client.chat.completions.create(
      {
        model: OPENROUTER_MODELS.worker,
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      },
      { timeout: 60_000 }
    );

    const text = completion.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON response from OpenRouter");

    const parsed = JSON.parse(jsonMatch[0]);
    const highlights: NewsItem[] = parsed.highlights || [];

    console.log(
      `[NewsAgent] Done in ${Date.now() - startTime}ms — ${highlights.length} highlights`
    );
    return { success: true, data: highlights };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    console.error("[NewsAgent] Error:", error);
    return { success: false, error };
  }
}
