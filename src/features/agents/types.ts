/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  summary: string;
  publishedAt: string;
}

export interface GitHubRepo {
  fullName: string;
  description: string;
  language: string | null;
  stars: number;
  url: string;
  topics: string[];
  pushedAt: string;
}

export interface GitHubTrend {
  repo: GitHubRepo;
  insight: string;
}

export interface AgentResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SavedRepo {
  fullName: string;
  url: string;
  stars: number;
  language: string | null;
  description: string;
  addedAt: string;
}

export interface Stack {
  id: string;
  name: string;
  description: string;
  tags: string[];
  imageUrl: string;
  repos: SavedRepo[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyReport {
  date: string;
  generatedAt: string;
  status: "success" | "partial" | "error";
  newsHighlights: NewsItem[];
  githubTrends: GitHubTrend[];
  leaderSummary: string;
  trendTheme: string;
  actionItems: string[];
  stats: {
    newsScanned: number;
    reposAnalyzed: number;
    durationMs: number;
  };
}
