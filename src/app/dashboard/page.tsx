/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  Settings,
  LogOut,
  Bell,
  TrendingUp,
  Users,
  Eye,
  Clock,
  ChevronRight,
  Plus,
} from "lucide-react";

const ALLOWED_EMAILS = ["khacquan2054@gmail.com"];

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview", active: true },
  { icon: FolderOpen, label: "Projects", id: "projects" },
  { icon: FileText, label: "Blog", id: "blog" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const stats = [
  { label: "Total Views", value: "—", icon: Eye, color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Visitors", value: "—", icon: Users, color: "text-green-400", bg: "bg-green-400/10" },
  { label: "Projects", value: "3", icon: FolderOpen, color: "text-primary", bg: "bg-primary/10" },
  { label: "Uptime", value: "99.9%", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-400/10" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeNav, setActiveNav] = useState("overview");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }
    if (status === "authenticated") {
      const isOwner = ALLOWED_EMAILS.includes(session?.user?.email ?? "");
      if (!isOwner) {
        router.replace("/");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !ALLOWED_EMAILS.includes(session?.user?.email ?? "")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-[#E1E0CC] flex">

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-64 shrink-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col min-h-screen sticky top-0"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <span className="text-black font-black text-xs">Q</span>
            </div>
            <div>
              <p className="text-xs font-bold text-[#E1E0CC] uppercase tracking-widest">Dashboard</p>
              <p className="text-[10px] text-gray-600">Portfolio CMS</p>
            </div>
          </a>
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
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/20"
                    : "text-gray-500 hover:text-[#E1E0CC] hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "group-hover:text-[#E1E0CC]"}`} />
                <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-primary/60" />}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shrink-0">
              {session.user?.image ? (
                <img src={session.user.image} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                  {session.user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#E1E0CC] truncate">{session.user?.name}</p>
              <p className="text-[10px] text-gray-600 truncate">{session.user?.email}</p>
            </div>
          </div>
          <button
            id="sidebar-logout-button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span className="font-medium uppercase tracking-wider">Đăng xuất</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-16 border-b border-white/5 px-8 flex items-center justify-between bg-black/50 backdrop-blur-sm sticky top-0 z-10"
        >
          <div>
            <h1 className="text-sm font-bold text-[#E1E0CC] uppercase tracking-widest">Overview</h1>
            <p className="text-[10px] text-gray-600 mt-0.5">
              {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="notification-button"
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors relative"
            >
              <Bell className="w-4 h-4 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>
            <button
              id="add-new-button"
              className="flex items-center gap-2 bg-primary text-black text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add New
            </button>
          </div>
        </motion.header>

        {/* Page Body */}
        <main className="flex-1 p-8 overflow-auto">

          {/* Welcome banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="bg-[#101010] border border-white/5 rounded-2xl p-6 mb-8 relative overflow-hidden"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative z-10">
              <p className="text-xs text-primary font-bold uppercase tracking-[0.2em] mb-2">👋 Welcome back</p>
              <h2 className="text-2xl font-bold text-[#E1E0CC]">Xin chào, {session.user?.name?.split(" ").at(-1)}!</h2>
              <p className="text-gray-500 text-sm mt-1">Đây là dashboard quản lý portfolio của bạn. Các module sẽ được thêm dần.</p>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
                  className="bg-[#101010] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 hover:border-white/10 transition-colors"
                >
                  <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#E1E0CC]">{stat.value}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Placeholder Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              className="bg-[#101010] border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[#E1E0CC] uppercase tracking-wider">Recent Activity</h3>
                <Clock className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex flex-col items-center justify-center h-32 text-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3">
                  <Clock className="w-5 h-5 text-gray-600" />
                </div>
                <p className="text-xs text-gray-600">Chưa có hoạt động nào</p>
                <p className="text-[10px] text-gray-700 mt-1">Module này sẽ được triển khai sau</p>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-[#101010] border border-white/5 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-[#E1E0CC] uppercase tracking-wider">Quick Actions</h3>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Thêm Project mới", icon: FolderOpen },
                  { label: "Viết Blog post", icon: FileText },
                  { label: "Cập nhật Settings", icon: Settings },
                ].map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/3 border border-white/5 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 text-left group"
                    >
                      <Icon className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors" />
                      <span className="text-xs text-gray-400 group-hover:text-[#E1E0CC] transition-colors font-medium">{action.label}</span>
                      <ChevronRight className="w-3 h-3 text-gray-700 ml-auto group-hover:text-primary transition-colors" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
