/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Zap,
  Newspaper,
  Github,
  Globe,
  Tags,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Star,
  TrendingUp,
  Loader2,
  Radar as RadarIcon,
  Diamond,
  Search,
  X,
} from "lucide-react";
import { DailyReport } from "@/features/agents/types";
import { DataRadar } from "./components/DataRadar";

const ALLOWED_EMAILS = ["khacquan2054@gmail.com"];

const navItems = [
  { icon: LayoutDashboard, label: "Tổng quan", id: "overview" },
  { icon: Github, label: "Khám phá GitHub", id: "github" },
  { icon: Globe, label: "Thế giới AI", id: "ai-news" },
  { icon: Tags, label: "Phân loại", id: "categorize" },
];

const PAGE_TITLES: Record<string, string> = {
  overview: "Bản Tin AI Hàng Ngày",
  github: "Khám Phá GitHub",
  "ai-news": "Thế Giới AI",
  categorize: "Phân Loại",
};

const STATUS_LABELS: Record<DailyReport["status"], string> = {
  success: "Thành công",
  partial: "Một phần",
  error: "Lỗi",
};

type AgentStatus = "idle" | "running" | "done" | "error";
type IconComponent = React.ComponentType<{ className?: string }>;

// ─── Source Row (sidebar) ────────────────────────────────────────────────────

function SourceRow({
  name, count, status, icon: Icon, color,
}: {
  name: string; count: number; status: AgentStatus; icon: IconComponent; color: string;
}) {
  const statusColors: Record<AgentStatus, string> = {
    idle: "bg-gray-600",
    running: "bg-blue-400 animate-pulse",
    done: "bg-green-400",
    error: "bg-red-400",
  };

  return (
    <div className="flex items-center gap-3 px-1 py-1.5">
      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0" style={{ color }}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <span className="flex-1 text-xs text-gray-400 truncate">{name}</span>
      <span className="text-xs font-bold text-[#E1E0CC]">{count}</span>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusColors[status]}`} />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, hint, icon: Icon,
}: {
  label: string; value: string | number; hint: string; icon: IconComponent;
}) {
  return (
    <div className="bg-[#101010] border border-white/5 rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{label}</span>
        <Icon className="w-3.5 h-3.5 text-gray-700" />
      </div>
      <span className="text-2xl font-black text-[#E1E0CC]">{value}</span>
      <span className="text-[10px] text-gray-600">{hint}</span>
    </div>
  );
}

// ─── Briefing Display ────────────────────────────────────────────────────────

function BriefingView({ report, online }: { report: DailyReport; online: number }) {
  const radarSources = [
    { key: "news", label: "Tin tức công nghệ", count: report.newsHighlights.length, color: "#60A5FA" },
    { key: "github", label: "GitHub nổi bật", count: report.githubTrends.length, color: "#C084FC" },
    { key: "insights", label: "Gợi ý hành động AI", count: report.actionItems.length, color: "#FBBF24" },
  ];

  return (
    <div className="flex flex-col gap-4">

      {/* Hero: headline + radar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="xl:col-span-2 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 relative overflow-hidden flex flex-col"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Bản Tin Sáng · Tổng Hợp AI Agent Team</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-[#E1E0CC] leading-tight">&quot;{report.trendTheme}&quot;</h2>
            <p className="text-sm text-gray-300 leading-relaxed">{report.leaderSummary}</p>

            {report.actionItems.length > 0 && (
              <div className="mt-auto bg-black/30 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
                <Zap className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest mb-1">Ưu Tiên Hàng Đầu</p>
                  <p className="text-sm text-[#E1E0CC] leading-relaxed">{report.actionItems[0]}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <DataRadar
            sources={radarSources}
            online={online}
            total={3}
            updatedAt={new Date(report.generatedAt).toLocaleTimeString("vi-VN")}
          />
        </motion.div>
      </div>

      {/* Remaining action items */}
      {report.actionItems.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#101010] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold text-[#E1E0CC] uppercase tracking-wider">Các Việc Cần Làm Khác</span>
          </div>
          <div className="flex flex-col gap-2">
            {report.actionItems.slice(1).map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Tin Tức Đã Quét" value={report.stats.newsScanned} hint={`${report.newsHighlights.length} bài nổi bật`} icon={Newspaper} />
        <StatCard label="Repo Phân Tích" value={report.stats.reposAnalyzed} hint={`${report.githubTrends.length} repo trending`} icon={Github} />
        <StatCard label="Hành Động Đề Xuất" value={report.actionItems.length} hint="cần xử lý hôm nay" icon={Zap} />
        <StatCard label="Thời Gian Xử Lý" value={`${(report.stats.durationMs / 1000).toFixed(1)}s`} hint={`trạng thái: ${STATUS_LABELS[report.status]}`} icon={Clock} />
      </div>

      {/* News + GitHub */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#101010] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded bg-blue-400/10 flex items-center justify-center text-[9px] font-bold text-blue-400 shrink-0">03</div>
            <Newspaper className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-[#E1E0CC] uppercase tracking-wider">AI Thế Giới Hôm Nay</span>
            <span className="ml-auto text-[10px] text-gray-600">{report.newsHighlights.length} tin</span>
          </div>
          <div className="flex flex-col gap-3">
            {report.newsHighlights.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-4">Chưa có dữ liệu tin tức</p>
            ) : (
              report.newsHighlights.map((news, i) => (
                <motion.a
                  key={i}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="group flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/5 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold text-primary/80 uppercase tracking-wider shrink-0">{news.source}</span>
                    <ExternalLink className="w-3 h-3 text-gray-700 group-hover:text-gray-400 transition-colors shrink-0 mt-0.5" />
                  </div>
                  <p className="text-xs font-semibold text-[#E1E0CC] leading-tight line-clamp-2 group-hover:text-white transition-colors">{news.title}</p>
                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{news.summary}</p>
                </motion.a>
              ))
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#101010] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded bg-purple-400/10 flex items-center justify-center text-[9px] font-bold text-purple-400 shrink-0">04</div>
            <Github className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-[#E1E0CC] uppercase tracking-wider">GitHub Repo Nóng</span>
            <span className="ml-auto text-[10px] text-gray-600">Tuần này</span>
          </div>
          <div className="flex flex-col gap-2">
            {report.githubTrends.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-4">Chưa có dữ liệu GitHub</p>
            ) : (
              report.githubTrends.map((trend, i) => (
                <motion.a
                  key={i}
                  href={trend.repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.04 }}
                  className="group flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-purple-500/20 hover:bg-purple-500/5 transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#E1E0CC] group-hover:text-white transition-colors truncate">{trend.repo.fullName}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-[10px] text-gray-400">{trend.repo.stars.toLocaleString()}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{trend.insight}</p>
                  {trend.repo.language && (
                    <span className="text-[9px] font-bold text-purple-400/70 uppercase tracking-wider">{trend.repo.language}</span>
                  )}
                </motion.a>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── GitHub Explore View ─────────────────────────────────────────────────────

type GithubPeriod = "day" | "week" | "month" | "year";

const PERIOD_OPTIONS: { id: GithubPeriod; label: string; ms: number }[] = [
  { id: "day",   label: "Ngày",  ms: 86_400_000 },
  { id: "week",  label: "Tuần",  ms: 7 * 86_400_000 },
  { id: "month", label: "Tháng", ms: 30 * 86_400_000 },
  { id: "year",  label: "Năm",   ms: 365 * 86_400_000 },
];

function GithubExploreView({ report }: { report: DailyReport }) {
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<GithubPeriod>("week");

  const now = Date.now();
  const periodMs = PERIOD_OPTIONS.find((p) => p.id === period)!.ms;

  const filteredTrends = report.githubTrends.filter((trend) => {
    const pushedMs = new Date(trend.repo.pushedAt).getTime();
    if (now - pushedMs > periodMs) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      trend.repo.fullName.toLowerCase().includes(q) ||
      (trend.repo.language?.toLowerCase() ?? "").includes(q) ||
      trend.repo.topics.some((t) => t.toLowerCase().includes(q)) ||
      trend.insight.toLowerCase().includes(q) ||
      trend.repo.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Github className="w-4 h-4 text-purple-400" />
          <h2 className="text-xs font-bold text-[#E1E0CC] uppercase tracking-wider">Khám Phá GitHub Trending</h2>
        </div>
        <span className="text-[10px] text-gray-600">
          {filteredTrends.length}/{report.githubTrends.length} repo · cập nhật {new Date(report.generatedAt).toLocaleTimeString("vi-VN")}
        </span>
      </div>

      {/* Search + Period filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm kiếm repo, ngôn ngữ, topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#101010] border border-white/5 rounded-xl pl-9 pr-9 py-2.5 text-xs text-[#E1E0CC] placeholder:text-gray-600 focus:outline-none focus:border-purple-500/30 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-[#101010] border border-white/5 rounded-xl p-1 shrink-0">
          {PERIOD_OPTIONS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                period === p.id
                  ? "bg-purple-500/15 text-purple-400 border border-purple-500/20"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredTrends.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Github className="w-8 h-8 text-gray-700" />
          <p className="text-xs text-gray-600">
            {search
              ? `Không tìm thấy repo nào khớp với "${search}"`
              : `Không có repo nào được cập nhật trong khoảng thời gian này`}
          </p>
          {!search && (
            <p className="text-[10px] text-gray-700">Thử chọn khoảng thời gian rộng hơn</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredTrends.map((trend, i) => (
            <motion.a
              key={trend.repo.fullName}
              href={trend.repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group flex flex-col gap-3 p-4 rounded-2xl bg-[#101010] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-sm font-bold text-[#E1E0CC] group-hover:text-white transition-colors truncate">{trend.repo.fullName}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-400 transition-colors shrink-0" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{trend.insight}</p>
              <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-white/5">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-[10px] text-gray-400">{trend.repo.stars.toLocaleString()}</span>
                </div>
                {trend.repo.language && (
                  <span className="text-[9px] font-bold text-purple-400/70 uppercase tracking-wider">{trend.repo.language}</span>
                )}
              </div>
              {trend.repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {trend.repo.topics.slice(0, 4).map((topic) => (
                    <span key={topic} className="text-[9px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-full">{topic}</span>
                  ))}
                </div>
              )}
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── AI News View ─────────────────────────────────────────────────────────────

function AINewsView({ report }: { report: DailyReport }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-bold text-[#E1E0CC] uppercase tracking-wider">Thế Giới AI Hôm Nay</h2>
        </div>
        <span className="text-[10px] text-gray-600">{report.newsHighlights.length} bài · cập nhật {new Date(report.generatedAt).toLocaleTimeString("vi-VN")}</span>
      </div>

      {report.newsHighlights.length === 0 ? (
        <p className="text-xs text-gray-600 text-center py-12">Chưa có dữ liệu tin tức.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.newsHighlights.map((news, i) => (
            <motion.a
              key={news.url || i}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex flex-col gap-2 p-4 rounded-2xl bg-[#101010] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold text-primary/80 uppercase tracking-wider">{news.source}</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-400 transition-colors shrink-0" />
              </div>
              <p className="text-sm font-semibold text-[#E1E0CC] leading-snug group-hover:text-white transition-colors">{news.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{news.summary}</p>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Categorize View (placeholder) ─────────────────────────────────────────────

function CategorizeView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-64 gap-6 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
        <Tags className="w-8 h-8 text-primary/60" />
      </div>
      <div>
        <p className="text-sm font-bold text-[#E1E0CC] mb-2">Phân loại — đang phát triển</p>
        <p className="text-xs text-gray-600 max-w-sm">Tính năng phân loại GitHub repo theo nhóm/chủ đề sẽ được triển khai sau.</p>
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("overview");
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [agentStatuses, setAgentStatuses] = useState<{
    news: AgentStatus; github: AgentStatus; leader: AgentStatus;
  }>({ news: "idle", github: "idle", leader: "idle" });

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") { router.replace("/"); return; }
    if (status === "authenticated") {
      if (!ALLOWED_EMAILS.includes(session?.user?.email ?? "")) { router.replace("/"); }
    }
  }, [status, session, router]);

  const fetchReport = useCallback(async () => {
    setLoadingReport(true);
    try {
      const res = await fetch("/api/agents/report");
      if (res.ok) setReport(await res.json());
    } catch { /* no report yet */ }
    finally { setLoadingReport(false); }
  }, []);

  useEffect(() => { if (status === "authenticated") fetchReport(); }, [status, fetchReport]);

  const handleRunAgents = async () => {
    setRunning(true);
    setRunError(null);
    setAgentStatuses({ news: "running", github: "running", leader: "idle" });

    try {
      const res = await fetch("/api/agents/run", { method: "POST" });
      setAgentStatuses((s) => ({ ...s, news: "done", github: "done", leader: "running" }));

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chạy agent thất bại");

      setAgentStatuses({ news: "done", github: "done", leader: "done" });
      await fetchReport();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lỗi không xác định";
      setRunError(msg);
      setAgentStatuses({ news: "error", github: "error", leader: "error" });
    } finally {
      setRunning(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session || !ALLOWED_EMAILS.includes(session?.user?.email ?? "")) return null;

  const newsCount = report?.newsHighlights.length ?? 0;
  const githubCount = report?.githubTrends.length ?? 0;
  const insightsCount = report?.actionItems.length ?? 0;
  const sourcesOnline = report ? [newsCount, githubCount, insightsCount].filter((n) => n > 0).length : 0;

  return (
    <div className="min-h-screen bg-black text-[#E1E0CC] flex">

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-60 shrink-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col min-h-screen sticky top-0"
      >
        {/* Logo */}
        <div className="p-5 border-b border-white/5">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="text-black font-black text-xs">Q</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#E1E0CC] uppercase tracking-widest">AI HQ</p>
              <p className="text-[9px] text-gray-600">Bảng Điều Khiển Portfolio</p>
            </div>
          </a>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1 px-3">Điều Hướng</p>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                  isActive ? "bg-primary/15 text-primary border border-primary/20" : "text-gray-500 hover:text-[#E1E0CC] hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : ""}`} />
                <span className="text-xs font-semibold uppercase tracking-wider flex-1">{item.label}</span>
                {isActive ? (
                  <ChevronRight className="w-3 h-3 text-primary/60" />
                ) : (
                  <span className="text-[9px] text-gray-700">{String(idx + 1).padStart(2, "0")}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Data Sources */}
        <div className="p-4 border-t border-white/5">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-2 px-1">Nguồn Dữ Liệu</p>
          <div className="flex flex-col">
            <SourceRow name="Tin tức công nghệ" count={newsCount} status={agentStatuses.news} icon={Newspaper} color="#60A5FA" />
            <SourceRow name="GitHub nổi bật" count={githubCount} status={agentStatuses.github} icon={Github} color="#C084FC" />
            <SourceRow name="Thông tin AI" count={insightsCount} status={agentStatuses.leader} icon={Brain} color="#FBBF24" />
          </div>
        </div>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-white/10 shrink-0">
              {session.user?.image
                ? <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">{session.user?.name?.[0]?.toUpperCase()}</div>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-[#E1E0CC] truncate">{session.user?.name}</p>
              <p className="text-[9px] text-gray-600 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            id="sidebar-logout-button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all group"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="font-medium uppercase tracking-wider">Đăng Xuất</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Info Bar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="border-b border-white/5 px-6 py-2.5 flex items-center justify-between gap-4 bg-black/50"
        >
          <div className="flex items-center gap-2 text-[10px]">
            <span className="font-bold text-primary uppercase tracking-widest">
              {now ? now.toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" }) : "—"}
            </span>
            {report && (
              <span className="text-gray-600">· cập nhật {new Date(report.generatedAt).toLocaleTimeString("vi-VN")}</span>
            )}
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
              <span className={`w-1.5 h-1.5 rounded-full ${sourcesOnline === 3 ? "bg-green-400" : sourcesOnline > 0 ? "bg-yellow-400" : "bg-gray-600"}`} />
              <span className={sourcesOnline === 3 ? "text-green-400" : sourcesOnline > 0 ? "text-yellow-400" : "text-gray-600"}>
                Đồng bộ {sourcesOnline}/3 nguồn
              </span>
            </span>
            <span className="hidden sm:inline text-sm font-mono text-[#E1E0CC] tabular-nums">
              {now ? now.toLocaleTimeString("vi-VN") : "--:--:--"}
            </span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              <RadarIcon className="w-3 h-3" />
              Radar Agent
            </div>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-14 border-b border-white/5 px-6 flex items-center justify-between gap-4 bg-black/50 backdrop-blur-sm sticky top-0 z-10 overflow-x-auto"
        >
          <div className="flex items-center gap-3 shrink-0">
            <TrendingUp className="w-4 h-4 text-primary" />
            <h1 className="text-xs font-bold text-[#E1E0CC] uppercase tracking-widest whitespace-nowrap">{PAGE_TITLES[activeNav]}</h1>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[10px] uppercase tracking-wider whitespace-nowrap">
            <span className="text-[#E1E0CC] font-bold">Tin tức <span className="text-gray-600 font-normal">{newsCount} mục</span></span>
            <Diamond className="w-2 h-2 text-gray-700" />
            <span className="text-[#E1E0CC] font-bold">GitHub <span className="text-gray-600 font-normal">{githubCount} mục</span></span>
            <Diamond className="w-2 h-2 text-gray-700" />
            <span className="text-[#E1E0CC] font-bold">AI Insights <span className="text-gray-600 font-normal">{insightsCount} mục</span></span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {report && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                report.status === "success" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                report.status === "partial" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                "text-red-400 bg-red-400/10 border-red-400/20"
              }`}>
                {report.status === "success" ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {STATUS_LABELS[report.status]}
              </div>
            )}

            <button
              id="run-agents-button"
              onClick={handleRunAgents}
              disabled={running}
              className="flex items-center gap-2 bg-primary text-black text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              {running ? "Đang chạy..." : "Chạy Agent"}
            </button>
          </div>
        </motion.header>

        {/* Body */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {activeNav === "categorize" ? (
              <motion.div key="categorize" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <CategorizeView />
              </motion.div>
            ) : loadingReport ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 gap-4"
              >
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-600 uppercase tracking-widest">Đang tải bản tin...</p>
              </motion.div>
            ) : report ? (
              <motion.div key={activeNav} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {activeNav === "overview" && <BriefingView report={report} online={sourcesOnline} />}
                {activeNav === "github" && <GithubExploreView report={report} />}
                {activeNav === "ai-news" && <AINewsView report={report} />}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-64 gap-6 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Brain className="w-8 h-8 text-primary/60" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#E1E0CC] mb-2">Chưa có bản tin nào</p>
                  <p className="text-xs text-gray-600 max-w-xs">Nhấn &quot;Chạy Agent&quot; để tạo bản tin đầu tiên. Các agent sẽ thu thập tin tức, phân tích xu hướng GitHub và tổng hợp thành một bản báo cáo.</p>
                </div>

                {runError && (
                  <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-2 rounded-xl max-w-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{runError}</span>
                  </div>
                )}

                <button
                  onClick={handleRunAgents}
                  disabled={running}
                  className="flex items-center gap-2 bg-primary text-black text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60"
                >
                  {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                  {running ? "Đang chạy Agent..." : "Tạo Bản Tin Đầu Tiên"}
                </button>

                {running && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Quá trình này có thể mất 15-30 giây...</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {runError && report && (
            <div className="mt-4 flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-2 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{runError}</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
