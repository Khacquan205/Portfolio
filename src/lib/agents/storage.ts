/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { DailyReport } from "./types";

// In-memory fallback for local dev without Upstash configured
const memStore = new Map<string, DailyReport>();

function isUpstashConfigured() {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function getRedis() {
  if (!isUpstashConfigured()) return null;
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export function getReportKey(date?: string): string {
  const d = date || new Date().toISOString().slice(0, 10);
  return `daily_report:${d}`;
}

export async function saveReport(report: DailyReport): Promise<void> {
  const key = getReportKey(report.date);
  const redis = await getRedis();
  if (redis) {
    // TTL: 14 days
    await redis.set(key, JSON.stringify(report), { ex: 14 * 24 * 60 * 60 });
    // Keep "latest" pointer
    await redis.set("daily_report:latest", JSON.stringify(report), {
      ex: 14 * 24 * 60 * 60,
    });
  } else {
    memStore.set(key, report);
    memStore.set("daily_report:latest", report);
    console.log("[Storage] Saved to in-memory store (no Upstash configured)");
  }
}

export async function getLatestReport(): Promise<DailyReport | null> {
  const redis = await getRedis();
  if (redis) {
    const data = await redis.get<string>("daily_report:latest");
    if (!data) return null;
    return typeof data === "string" ? JSON.parse(data) : data;
  } else {
    return memStore.get("daily_report:latest") || null;
  }
}

export async function getReportByDate(date: string): Promise<DailyReport | null> {
  const key = getReportKey(date);
  const redis = await getRedis();
  if (redis) {
    const data = await redis.get<string>(key);
    if (!data) return null;
    return typeof data === "string" ? JSON.parse(data) : data;
  } else {
    return memStore.get(key) || null;
  }
}
