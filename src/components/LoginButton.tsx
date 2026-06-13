/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import Link from "next/link";

export function LoginButton() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="w-28 h-9 rounded-full bg-white/10 animate-pulse" />
    );
  }

  if (session?.user) {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          id="user-menu-button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 rounded-full pl-1 pr-3 py-1 hover:border-white/30 transition-all duration-300 group"
        >
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full overflow-hidden border border-white/20 shrink-0">
            {session.user.image ? (
              <img
                src={session.user.image}
                alt={session.user.name ?? "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/40 flex items-center justify-center text-xs font-bold text-primary">
                {session.user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
          </div>

          {/* Name */}
          <span className="text-[11px] font-semibold text-[#E1E0CC] uppercase tracking-wider max-w-[90px] truncate">
            {session.user.name?.split(" ").at(-1)}
          </span>

          <ChevronDown
            className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {dropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="absolute right-0 top-full mt-2 w-52 bg-[#141414] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 z-[60]"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-xs text-[#E1E0CC] font-semibold truncate">{session.user.name}</p>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">{session.user.email}</p>
              </div>

              {/* Dashboard link (only visible for owner) */}
              {(session as any).isOwner && (
                <Link
                  href="/dashboard"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-xs text-gray-300 hover:text-[#E1E0CC] hover:bg-white/5 transition-colors group/item"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-primary group-hover/item:scale-110 transition-transform" />
                  <span className="font-medium uppercase tracking-wider">Dashboard</span>
                </Link>
              )}

              {/* Logout */}
              <button
                id="logout-button"
                onClick={() => {
                  setDropdownOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-xs text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-colors group/item"
              >
                <LogOut className="w-3.5 h-3.5 group-hover/item:scale-110 transition-transform" />
                <span className="font-medium uppercase tracking-wider">Đăng xuất</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.button
      id="google-login-button"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      onClick={() => signIn("google")}
      className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 hover:border-white/30 hover:bg-black/80 transition-all duration-300 group"
    >
      {/* Google Icon */}
      <svg
        className="w-3.5 h-3.5 shrink-0"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
      <span className="text-[11px] font-bold text-[#E1E0CC] uppercase tracking-wider">
        Login
      </span>
    </motion.button>
  );
}
