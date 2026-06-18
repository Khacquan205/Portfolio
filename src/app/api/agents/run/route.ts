/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Main orchestration endpoint for the AI Agent Team.
 * Triggered by: Vercel Cron Job (6AM VN time) OR manual trigger from Dashboard owner.
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { runNewsAgent } from "@/features/agents/newsAgent";
import { runGitHubAgent } from "@/features/agents/githubAgent";
import { runLeaderAgent } from "@/features/agents/leaderAgent";
import { saveReport } from "@/features/agents/storage";
import { DailyReport } from "@/features/agents/types";

export const maxDuration = 300; // Pro plan; Hobby falls back to 10s (cron has higher limits)
export const dynamic = "force-dynamic";

const ALLOWED_EMAILS = ["khacquan2054@gmail.com"];

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  // Auth: allow Vercel Cron (sends "Authorization: Bearer $CRON_SECRET" automatically,
  // or "x-cron-secret" for manual/local testing) or dashboard owner
  const authHeader = req.headers.get("authorization");
  const cronSecret =
    req.headers.get("x-cron-secret") ||
    authHeader?.replace(/^Bearer\s+/i, "");
  const isValidCron = Boolean(
    cronSecret && process.env.CRON_SECRET && cronSecret === process.env.CRON_SECRET
  );

  let isOwner = false;
  if (!isValidCron) {
    const session = await getServerSession(authOptions);
    isOwner = ALLOWED_EMAILS.includes(session?.user?.email ?? "");
    if (!isOwner) {
      return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 401 });
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  console.log(`[Agents] Starting daily run for ${today}...`);

  // Run News Agent and GitHub Agent in PARALLEL
  const [newsResult, githubResult] = await Promise.all([
    runNewsAgent(),
    runGitHubAgent(),
  ]);

  const newsHighlights = newsResult.data || [];
  const githubTrends = githubResult.data || [];

  console.log(
    `[Agents] Workers done — News: ${newsHighlights.length}, GitHub: ${githubTrends.length}`
  );

  // Leader Agent synthesizes everything
  const leaderResult = await runLeaderAgent({
    news: newsHighlights,
    github: githubTrends,
    date: today,
  });

  const status: DailyReport["status"] =
    newsResult.success && githubResult.success && leaderResult.success
      ? "success"
      : !newsResult.success && !githubResult.success
      ? "error"
      : "partial";

  const report: DailyReport = {
    date: today,
    generatedAt: new Date().toISOString(),
    status,
    newsHighlights,
    githubTrends,
    trendTheme: leaderResult.data?.trendTheme || "Bản Tin Công Nghệ Hàng Ngày",
    leaderSummary: leaderResult.data?.leaderSummary || "",
    actionItems: leaderResult.data?.actionItems || [],
    stats: {
      newsScanned: newsHighlights.length,
      reposAnalyzed: githubTrends.length,
      durationMs: Date.now() - startTime,
    },
  };

  await saveReport(report);

  console.log(`[Agents] Report saved — status: ${status}, duration: ${report.stats.durationMs}ms`);

  return NextResponse.json({
    success: true,
    status,
    date: today,
    stats: report.stats,
    errors: {
      news: newsResult.error,
      github: githubResult.error,
      leader: leaderResult.error,
    },
  });
}

// Health check
export async function GET() {
  return NextResponse.json({
    service: "AI Agent Team",
    agents: ["NewsAgent (OpenRouter)", "GitHubAgent (OpenRouter)", "LeaderAgent (OpenRouter)"],
    status: "ready",
  });
}
