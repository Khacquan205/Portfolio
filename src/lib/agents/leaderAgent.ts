/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Leader / CEO Agent — powered by Claude Sonnet
 * Receives raw data from all Worker Agents and synthesizes a daily briefing.
 */
import Anthropic from "@anthropic-ai/sdk";
import { AgentResult, DailyReport, GitHubTrend, NewsItem } from "./types";

interface LeaderInput {
  news: NewsItem[];
  github: GitHubTrend[];
  date: string;
}

export async function runLeaderAgent(
  input: LeaderInput
): Promise<AgentResult<Partial<DailyReport>>> {
  console.log("[LeaderAgent] Starting synthesis with Claude Sonnet...");
  const startTime = Date.now();

  try {
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    });

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

Respond in JSON ONLY (no markdown, no extra text):
{
  "trendTheme": "1 headline sentence capturing the dominant tech theme today (max 15 words)",
  "leaderSummary": "3-4 sentences of your synthesis: connect the news dots, identify what the github trends reveal about where the industry is heading, and what this means for a developer. Write in a direct, smart tone.",
  "actionItems": [
    "Specific, concrete action the developer should consider doing today (not generic advice)",
    "Another specific action",
    "Another specific action"
  ]
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") throw new Error("Unexpected response type");

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON from Claude");

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

    // Fallback: generate basic summary without Claude
    return {
      success: false,
      error,
      data: {
        trendTheme: "Daily briefing — AI analysis unavailable",
        leaderSummary: `Today's briefing collected ${input.news.length} news items and ${input.github.length} GitHub trends. Manual review recommended.`,
        actionItems: ["Check the news highlights below", "Review GitHub trending repos"],
      },
    };
  }
}
