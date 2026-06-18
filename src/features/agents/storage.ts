/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { DailyReport } from "./types";

// In-memory fallback for local dev without Upstash configured.
// Next.js dev (Turbopack) re-evaluates this module on file edits, wiping
// this Map — so we also mirror writes to a temp file (see below) that
// survives those reloads.
const memStore = new Map<string, DailyReport>();

// File-based mirror of memStore, used when no Upstash/Redis is configured.
// Lives in the OS temp dir so it survives dev-server module reloads.
const FILE_STORE_PATH = path.join(os.tmpdir(), "portfolio-agent-reports.json");

async function readFileStore(): Promise<Record<string, DailyReport>> {
  try {
    const raw = await fs.readFile(FILE_STORE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeFileStore(data: Record<string, DailyReport>): Promise<void> {
  try {
    await fs.writeFile(FILE_STORE_PATH, JSON.stringify(data), "utf-8");
  } catch (err) {
    console.warn("[Storage] Failed to write file store:", err);
  }
}

// Supports both standalone Upstash (UPSTASH_REDIS_REST_*) and the
// Vercel Marketplace "Upstash"/KV integration (KV_REST_API_*), which
// expose the same Upstash REST API under different env var names.
function getRedisCredentials() {
  const url =
    process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return url && token ? { url, token } : null;
}

async function getRedis() {
  const credentials = getRedisCredentials();
  if (!credentials) return null;
  const { Redis } = await import("@upstash/redis");
  return new Redis(credentials);
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

    const fileStore = await readFileStore();
    fileStore[key] = report;
    fileStore["daily_report:latest"] = report;
    await writeFileStore(fileStore);

    console.log("[Storage] Saved to in-memory + file store (no Upstash configured)");
  }
}

export async function getLatestReport(): Promise<DailyReport | null> {
  const redis = await getRedis();
  if (redis) {
    const data = await redis.get<string>("daily_report:latest");
    if (!data) return null;
    return typeof data === "string" ? JSON.parse(data) : data;
  } else {
    const cached = memStore.get("daily_report:latest");
    if (cached) return cached;
    const fileStore = await readFileStore();
    return fileStore["daily_report:latest"] || null;
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
    const cached = memStore.get(key);
    if (cached) return cached;
    const fileStore = await readFileStore();
    return fileStore[key] || null;
  }
}
