/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Leader / CEO Agent — powered via OpenRouter
 * Receives raw data from all Worker Agents and synthesizes a daily briefing.
 */
import { getOpenRouterClient, OPENROUTER_MODELS } from "./openrouter";
import { AgentResult, DailyReport, GitHubTrend, NewsItem } from "./types";

interface LeaderInput {
  news: NewsItem[];
  github: GitHubTrend[];
  date: string;
}

export async function runLeaderAgent(
  input: LeaderInput
): Promise<AgentResult<Partial<DailyReport>>> {
  console.log("[LeaderAgent] Starting synthesis via OpenRouter...");
  const startTime = Date.now();

  try {
    const client = getOpenRouterClient();

    const newsSection =
      input.news.length > 0
        ? input.news
            .map(
              (n, i) =>
                `${i + 1}. [${n.source}] ${n.title}\n   ${n.summary}\n   URL: ${n.url}`
            )
            .join("\n\n")
        : "No news data available today.";

    const githubSection =
      input.github.length > 0
        ? input.github
            .map(
              (g, i) =>
                `${i + 1}. ⭐${g.repo.stars.toLocaleString()} — ${g.repo.fullName} (${g.repo.language || "N/A"})\n   ${g.repo.description}\n   Insight: ${g.insight}`
            )
            .join("\n\n")
        : "No GitHub trend data available today.";

    const today = new Date(input.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `You are the CEO/Leader AI of a personal intelligence system for a senior Full Stack Developer (Nguyen Khac Quan). Your job is to synthesize data from your worker agents and deliver a sharp, actionable morning briefing.

TODAY: ${today}

=== TECH NEWS (from News Agent) ===
${newsSection}

=== GITHUB TRENDS (from GitHub Agent) ===
${githubSection}

=== YOUR TASK ===
Synthesize this data into a morning briefing. Be direct, insightful, and actionable — like a smart COO briefing the CEO. Focus on what matters for a developer building products with AI.

Respond in JSON ONLY (no markdown, no extra text). Write ALL fields below in natural, easy-to-understand Vietnamese (tiếng Việt tự nhiên, dễ hiểu, không dịch máy):
{
  "trendTheme": "1 câu tiêu đề ngắn nêu bật chủ đề công nghệ nổi bật nhất hôm nay (tối đa 15 từ)",
  "leaderSummary": "3-4 câu tổng hợp: liên kết các tin tức lại với nhau, chỉ ra xu hướng GitHub đang phản ánh điều gì về ngành, và ý nghĩa của nó với một developer. Viết với giọng văn trực tiếp, sắc bén.",
  "actionItems": [
    "Hành động cụ thể, rõ ràng mà developer nên làm ngay hôm nay (không nói chung chung)",
    "Một hành động cụ thể khác",
    "Một hành động cụ thể khác"
  ]
}`;

    const completion = await client.chat.completions.create(
      {
        model: OPENROUTER_MODELS.leader,
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      },
      { timeout: 60_000 }
    );

    const text = completion.choices?.[0]?.message?.content;
    if (!text) throw new Error("Empty response from OpenRouter");

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON from LeaderAgent model");

    const parsed = JSON.parse(jsonMatch[0]);

    console.log(`[LeaderAgent] Done in ${Date.now() - startTime}ms`);
    return {
      success: true,
      data: {
        trendTheme: parsed.trendTheme || "Tech trends synthesized",
        leaderSummary: parsed.leaderSummary || "",
        actionItems: parsed.actionItems || [],
      },
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    console.error("[LeaderAgent] Error:", error);

    // Fallback: generate basic summary without the LLM
    return {
      success: false,
      error,
      data: {
        trendTheme: "Bản tin hôm nay — Chưa thể phân tích bằng AI",
        leaderSummary: `Bản tin hôm nay đã thu thập được ${input.news.length} tin tức và ${input.github.length} repo GitHub đang nổi. Bạn nên xem lại thủ công bên dưới.`,
        actionItems: ["Xem các tin tức nổi bật bên dưới", "Xem các repo GitHub đang trending"],
      },
    };
  }
}
