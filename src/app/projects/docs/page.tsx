"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";

const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";
const SESSION_KEY = "docs_authed";

function DocsAuthContent() {
  const searchParams = useSearchParams();
  const docsUrl = searchParams.get("url") ?? "";
  const projectName = searchParams.get("project") ?? "Dự án";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (username === ADMIN_USER && password === ADMIN_PASS) {
        sessionStorage.setItem(SESSION_KEY, "1");
        if (docsUrl) {
          window.location.href = docsUrl;
        } else {
          setError("Tài liệu chưa có URL. Vui lòng liên hệ admin.");
          setLoading(false);
        }
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng.");
        setLoading(false);
      }
    }, 400);
  }

  return (
    <main className="min-h-screen bg-black text-[#E1E0CC] flex flex-col">

      {/* Navbar */}
      <nav className="px-6 md:px-12 py-5 flex items-center border-b border-white/5">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#E1E0CC] uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Projects
        </Link>
      </nav>

      {/* Center form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 mx-auto">
            <Lock className="w-6 h-6 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-center text-[#E1E0CC] mb-1">Tài liệu hệ thống</h1>
          <p className="text-xs text-gray-500 text-center mb-8">
            <span className="text-primary/70">{projectName}</span> · Yêu cầu xác thực để tiếp tục
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tên đăng nhập</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                autoComplete="off"
                required
                className="bg-[#101010] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#E1E0CC] placeholder-gray-700 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  autoComplete="off"
                  required
                  className="w-full bg-[#101010] border border-white/10 rounded-xl px-4 py-3 pr-11 text-sm text-[#E1E0CC] placeholder-gray-700 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 text-center bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 bg-primary text-black font-bold text-sm px-6 py-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {loading ? "Đang xác thực..." : "Truy cập tài liệu"}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}

export default function DocsAuthPage() {
  return (
    <Suspense>
      <DocsAuthContent />
    </Suspense>
  );
}
