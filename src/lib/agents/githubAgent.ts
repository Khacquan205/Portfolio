/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * GitHub Trending Worker Agent — powered by Gemini Flash
 * Uses GitHub Search API to find AI/ML repos with high star velocity this week,
 * then Gemini Flash analyzes the trends.
 */
import { GoogleGenAI } from "@google/genai";
import { AgentResult, GitHubRepo, GitHubTrend } from "./types";

interface GitHubSearchItem {
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  topics: string[];
  pushed_at: string;
}

interface GitHubSearchResponse {
  items: GitHubSearchItem[];
  total_count: number;
}

async function searchGitHub(query: string): Promise<GitHubSearchItem[]> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Portfolio-AI-Agent/1.0",
  };

  if (process.env.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=20`;

  const res = await fetch(url, { headers });
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const data: GitHubSearchResponse = await res.json();
  return data.items || [];
}

export async function runGitHubAgent(): Promise<AgentResult<GitHubTrend[]>> {
  console.log("[GitHubAgent] Starting...");
  const startTime = Date.now();

  try {
    // Get date 7 days ago
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = weekAgo.toISOString().slice(0, 10);

    // Search for AI/ML repos with significant stars pushed this week
    const queries = [
      `topic:llm pushed:>${weekAgoStr} stars:>100`,
      `topic:ai topic:python pushed:>${weekAgoStr} stars:>200`,
      `"large language model" OR "generative ai" pushed:>${weekAgoStr} stars:>100`,
    ];

    const results = await Promise.all(
      queries.map((q) =>
        searchGitHub(q).catch(() => [] as GitHubSearchItem[])
      )
    );

    // Deduplicate by full_name
    const seen = new Set<string>();
    const allRepos: GitHubRepo[] = results
      .flat()
      .filter((item) => {
        if (seen.has(item.full_name)) return false;
        seen.add(item.full_name);
        return true;
      })
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 15)
      .map((item) => ({
        fullName: item.full_name,
        description: item.description || "No description",
        language: item.language,
        stars: item.stargazers_count,
        url: item.html_url,
        topics: item.topics || [],
        pushedAt: item.pushed_at,
      }));

    console.log(`[GitHubAgent] Found ${allRepos.length} repos`);

    if (allRepos.length === 0) {
      return { success: false, error: "No repos found" };
    }

    // Gemini Flash analyzes the trends
    const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const reposText = allRepos
      .map(
        (r, i) =>
          `[${i + 1}] ${r.fullName} ⭐${r.stars.toLocaleString()}\n` +
          `Language: ${r.language || "N/A"} | Topics: ${r.topics.slice(0, 5).join(", ") || "none"}\n` +
          `Description: ${r.description}\n` +
          `Last pushed: ${r.pushedAt}`
      )
      .join("\n\n");

    const prompt = `You are a senior developer analyzing GitHub's AI/ML ecosystem. Analyze these trending repositories from the past week and identify the TOP 8 most significant ones.

REPOSITORIES:
${reposText}

For each selected repo, provide a brief insight about WHY it's trending and what technology/trend it represents.

Respond in JSON ONLY (no markdown):
{
  "trends": [
    {
      "fullName": "owner/repo",
      "insight": "2-sentence insight: what this repo does and why developers should pay attention"
    }
  ],
  "overallTrend": "1 sentence describing the dominant trend across all these repos"
}`;

    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid JSON from Gemini");

    const parsed = JSON.parse(jsonMatch[0]);
    const trendMap = new Map<string, string>(
      (parsed.trends || []).map((t: { fullName: string; insight: string }) => [
        t.fullName,
        t.insight,
      ])
    );

    const githubTrends: GitHubTrend[] = allRepos
      .filter((r) => trendMap.has(r.fullName))
      .slice(0, 8)
      .map((repo) => ({
        repo,
        insight: trendMap.get(repo.fullName) || "",
      }));

    console.log(
      `[GitHubAgent] Done in ${Date.now() - startTime}ms — ${githubTrends.length} trends`
    );
    return {
      success: true,
      data: githubTrends,
      error: parsed.overallTrend,
    };
  } catch (err) {
    const error = err instanceof Error ? err.message : "Unknown error";
    console.error("[GitHubAgent] Error:", error);
    return { success: false, error };
  }
}
