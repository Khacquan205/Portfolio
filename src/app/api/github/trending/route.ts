import { NextRequest, NextResponse } from "next/server";
import { getOpenRouterClient, OPENROUTER_MODELS } from "@/features/agents/openrouter";

export interface TrendingRepo {
  fullName: string;
  description: string;
  language: string | null;
  stars: number;
  starsToday: number;
  forks: number;
  url: string;
}

type Since = "daily" | "weekly" | "monthly";

function cleanHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function parseNum(text: string): number {
  const m = text.replace(/,/g, "").match(/\d+/);
  return m ? parseInt(m[0], 10) : 0;
}

function parseGithubTrending(html: string): TrendingRepo[] {
  const repos: TrendingRepo[] = [];
  const parts = html.split(/<article\s[^>]*Box-row[^>]*>/);

  for (let i = 1; i < parts.length; i++) {
    const article = parts[i].split("</article>")[0];

    const pathMatch = article.match(/href="\/([^/"]+\/[^/"?#\s]+)"/);
    if (!pathMatch) continue;
    const fullName = pathMatch[1];
    if (fullName.split("/").length !== 2) continue;

    const descMatch = article.match(/<p[^>]*>\s*([\s\S]*?)\s*<\/p>/);
    const description = descMatch ? cleanHtml(descMatch[1]) : "";

    const langMatch = article.match(/itemprop="programmingLanguage">\s*([^<]+)\s*</);
    const language = langMatch ? langMatch[1].trim() : null;

    const starsMatch = article.match(/\/stargazers[^"]*"[^>]*>([\s\S]*?)<\/a>/);
    const stars = starsMatch ? parseNum(cleanHtml(starsMatch[1])) : 0;

    const forksMatch = article.match(/\/network\/members[^"]*"[^>]*>([\s\S]*?)<\/a>/);
    const forks = forksMatch ? parseNum(cleanHtml(forksMatch[1])) : 0;

    const todayMatch = article.match(/([\d,]+)\s+stars?\s+today/i);
    const starsToday = todayMatch ? parseNum(todayMatch[1]) : 0;

    repos.push({ fullName, description, language, stars, starsToday, forks, url: `https://github.com/${fullName}` });
  }

  return repos;
}

async function summarizeInVietnamese(repos: TrendingRepo[]): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (!process.env.OPENROUTER_API_KEY || repos.length === 0) return result;

  const repoList = repos
    .map((r, i) => `${i + 1}. ${r.fullName}${r.description ? ` — "${r.description}"` : " — (no description)"}${r.language ? ` [${r.language}]` : ""}`)
    .join("\n");

  const prompt = `Bạn là trợ lý tóm tắt repo GitHub. Với danh sách repo GitHub trending dưới đây, hãy viết TÓM TẮT TIẾNG VIỆT cho mỗi repo gồm đúng 3 dòng ngắn:
- Dòng 1: repo này làm gì (mục đích chính)
- Dòng 2: điểm nổi bật / tính năng thú vị nhất
- Dòng 3: phù hợp cho ai / dùng trong trường hợp nào

Mỗi dòng tối đa 15 từ. Nối 3 dòng bằng dấu xuống dòng (\\n). Không dùng gạch đầu dòng hay số thứ tự.

Chỉ trả về JSON array, không có gì khác:
[{"fullName":"owner/repo","summary":"dòng 1\\ndòng 2\\ndòng 3"}, ...]

Danh sách repo:
${repoList}`;

  try {
    const client = getOpenRouterClient();
    const response = await client.chat.completions.create({
      model: OPENROUTER_MODELS.worker,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const text = response.choices[0]?.message?.content ?? "";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return result;

    const parsed: { fullName: string; summary: string }[] = JSON.parse(jsonMatch[0]);
    for (const item of parsed) {
      if (item.fullName && item.summary) result.set(item.fullName, item.summary);
    }
  } catch {
    // AI failed — fall back to original descriptions
  }

  return result;
}

export async function GET(req: NextRequest) {
  const since = (req.nextUrl.searchParams.get("since") ?? "daily") as Since;
  if (!["daily", "weekly", "monthly"].includes(since)) {
    return NextResponse.json({ error: "Invalid since param" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://github.com/trending?since=${since}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return NextResponse.json({ error: `GitHub returned ${res.status}` }, { status: 502 });
    }

    const html = await res.text();
    const repos = parseGithubTrending(html);

    // Translate + summarize descriptions via OpenRouter
    const summaries = await summarizeInVietnamese(repos);
    const enriched = repos.map((r) => ({
      ...r,
      description: summaries.get(r.fullName) ?? r.description,
    }));

    return NextResponse.json(enriched, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
