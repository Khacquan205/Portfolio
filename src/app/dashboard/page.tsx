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
  FolderOpen,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
  RefreshCw,
  Newspaper,
  Github,
  Brain,
  CheckCircle,
  AlertCircle,
  Clock,
  ExternalLink,
  Star,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { DailyReport } from "../../lib/agents/types";

const ALLOWED_EMAILS = ["khacquan2054@gmail.com"];

const navItems = [
  { icon: LayoutDashboard, label: "Briefing", id: "overview" },
  { icon: FolderOpen, label: "Projects", id: "projects" },
  { icon: FileText, label: "Blog", id: "blog" },
  { icon: Settings, label: "Settings", id: "settings" },
];

// ─── Agent Card ─────────────────────────────────────────────────────────────

function AgentCard({
  name, role, model, status, icon: Icon,
}: {
  name: string; role: string; model: string;
  status: "idle" | "running" | "done" | "error"; icon: React.ElementType;
}) {
  const colors = {
    idle: "text-gray-500 bg-gray-500/10 border-gray-500/20",
    running: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    done: "text-green-400 bg-green-400/10 border-green-400/20",
    error: "text-red-400 bg-red-400/10 border-red-400/20",
  };

  return (
    <div className={`border rounded-xl p-3 flex items-center gap-3 transition-all duration-500 ${colors[status]}`}>
      <div className="w-8 h-8 rounded-lg bg-current/10 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#E1E0CC] truncate">{name}</p>
        <p className="text-[10px] text-gray-600 truncate">{role}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[9px] uppercase tracking-wider font-bold">{status}</span>
        <span className="text-[9px] text-gray-700">{model}</span>
      </div>
    </div>
  );
}

// ─── Briefing Display ────────────────────────────────────────────────────────

function BriefingView({ report }: { report: DailyReport }) {
  return (
    <div className="flex flex-col gap-6">

      {/* Leader Summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">CEO Briefing</span>
          </div>
          <h2 className="text-lg font-bold text-[#E1E0CC] mb-3 leading-tight">"{report.trendTheme}"</h2>
          <p className="text-sm text-gray-300 leading-relaxed">{report.leaderSummary}</p>
        </div>
      </motion.div>

      {/* Action Items */}
      {report.actionItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#101010] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-bold text-[#E1E0CC] uppercase tracking-wider">Today's Action Items</span>
          </div>
          <div className="flex flex-col gap-2">
            {report.actionItems.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* News Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#101010] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-[#E1E0CC] uppercase tracking-wider">Tech News</span>
            <span className="ml-auto text-[10px] text-gray-600">{report.newsHighlights.length} stories</span>
          </div>
          <div className="flex flex-col gap-3">
            {report.newsHighlights.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-4">No news data</p>
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

        {/* GitHub Trends */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#101010] border border-white/5 rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <Github className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-[#E1E0CC] uppercase tracking-wider">GitHub Trending</span>
            <span className="ml-auto text-[10px] text-gray-600">This week</span>
          </div>
          <div className="flex flex-col gap-2">
            {report.githubTrends.length === 0 ? (
              <p className="text-xs text-gray-600 text-center py-4">No GitHub data</p>
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

      {/* Stats Footer */}
      <div className="flex items-center gap-4 text-[10px] text-gray-700 px-1">
        <span>Generated: {new Date(report.generatedAt).toLocaleString("vi-VN")}</span>
        <span>•</span>
        <span>{report.stats.newsScanned} news · {report.stats.reposAnalyzed} repos</span>
        <span>•</span>
        <span>{(report.stats.durationMs / 1000).toFixed(1)}s</span>
      </div>
    </div>
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
  const [agentStatuses, setAgentStatuses] = useState<{
    news: "idle" | "running" | "done" | "error";
    github: "idle" | "running" | "done" | "error";
    leader: "idle" | "running" | "done" | "error";
  }>({ news: "idle", github: "idle", leader: "idle" });

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
      if (!res.ok) throw new Error(data.error || "Agent run failed");

      setAgentStatuses({ news: "done", github: "done", leader: "done" });
      await fetchReport();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
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
              <p className="text-[9px] text-gray-600">Portfolio Dashboard</p>
            </div>
          </a>
        </div>

        {/* Agent Team Status */}
        <div className="p-4 border-b border-white/5">
          <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-3">Agent Team</p>
          <div className="flex flex-col gap-2">
            <AgentCard name="News Agent" role="RSS Crawler" model="Gemini Flash" status={agentStatuses.news} icon={Newspaper} />
            <AgentCard name="GitHub Agent" role="Trend Analyzer" model="Gemini Flash" status={agentStatuses.github} icon={Github} />
            <AgentCard name="CEO Agent" role="Synthesizer" model="Claude Sonnet" status={agentStatuses.leader} icon={Brain} />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map((item) => {
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
                <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-primary/60" />}
              </button>
            );
          })}
        </nav>

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
            <span className="font-medium uppercase tracking-wider">Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-black/50 backdrop-blur-sm sticky top-0 z-10"
        >
          <div className="flex items-center gap-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <h1 className="text-xs font-bold text-[#E1E0CC] uppercase tracking-widest">Daily AI Briefing</h1>
              {report && (
                <p className="text-[9px] text-gray-600">
                  {new Date(report.date).toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status badge */}
            {report && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                report.status === "success" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                report.status === "partial" ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" :
                "text-red-400 bg-red-400/10 border-red-400/20"
              }`}>
                {report.status === "success" ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {report.status}
              </div>
            )}

            <button
              id="run-agents-button"
              onClick={handleRunAgents}
              disabled={running}
              className="flex items-center gap-2 bg-primary text-black text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              {running ? "Running..." : "Run Agents"}
            </button>
          </div>
        </motion.header>

        {/* Body */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            {loadingReport ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-64 gap-4"
              >
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-600 uppercase tracking-widest">Loading briefing...</p>
              </motion.div>
            ) : report ? (
              <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <BriefingView report={report} />
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
                  <p className="text-sm font-bold text-[#E1E0CC] mb-2">No briefing yet</p>
                  <p className="text-xs text-gray-600 max-w-xs">Press "Run Agents" to generate your first daily briefing. The agents will collect news, analyze GitHub trends, and synthesize a report.</p>
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
                  {running ? "Agents Running..." : "Generate First Briefing"}
                </button>

                {running && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>This may take 15-30 seconds...</span>
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
