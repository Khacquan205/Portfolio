"use client";

import { motion } from "motion/react";
import { ArrowLeft, ExternalLink, BookOpen, Map } from "lucide-react";
import Link from "next/link";
import { projects } from "@/features/portfolio/data";
import { LoginButton } from "@/features/auth/components/LoginButton";

export default function ProjectsPage() {
  function docsHref(project: (typeof projects)[number]) {
    const params = new URLSearchParams({
      url: project.docs ?? "",
      project: project.title,
    });
    return `/projects/docs?${params.toString()}`;
  }

  return (
    <main className="min-h-screen bg-black text-[#E1E0CC] selection:bg-primary/30 selection:text-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 px-6 md:px-12 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#E1E0CC] uppercase tracking-widest transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Portfolio
        </Link>
        <LoginButton />
      </nav>

      <div className="pt-28 pb-24 px-4 md:px-8 max-w-screen-xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="text-[10px] sm:text-xs text-primary font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 inline-block mb-6">
            Personal Projects
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#E1E0CC] leading-tight">
            My Work
          </h1>
          <p className="mt-4 text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
            Các dự án tôi đã xây dựng — từ hệ thống bán lẻ đến nền tảng realtime.
          </p>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group bg-[#101010] border border-white/5 rounded-2xl p-6 flex flex-col gap-5 hover:border-primary/20 hover:bg-[#111] transition-all duration-300 shadow-[inset_1px_1px_0px_rgba(225,224,204,0.03)]"
            >
              {/* Icon + ID */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center justify-center overflow-hidden">
                  {project.iconUrl ? (
                    <img src={project.iconUrl} alt={project.title} className="w-8 h-8 object-cover" />
                  ) : (
                    <Map className="w-5 h-5 text-cyan-400" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{project.id}</span>
              </div>

              {/* Title + description */}
              <div className="flex flex-col gap-2 flex-1">
                <h2 className="text-lg font-bold text-[#E1E0CC] group-hover:text-primary transition-colors duration-300 leading-tight">
                  {project.title}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">{project.description}</p>
              </div>

              {/* Highlights */}
              <ul className="flex flex-col gap-1.5">
                {project.highlights.map((h, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="text-primary mt-0.5 shrink-0">›</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-semibold text-primary/70 bg-primary/5 border border-primary/10 rounded-full px-2.5 py-0.5 uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">

                {/* Docs button */}
                <Link
                  href={docsHref(project)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-[#E1E0CC] uppercase tracking-wider hover:bg-white/10 hover:border-white/20 transition-all group/btn"
                >
                  <BookOpen className="w-3.5 h-3.5 text-gray-400 group-hover/btn:text-[#E1E0CC] transition-colors" />
                  Tài liệu
                </Link>

                {/* Website button */}
                {project.website ? (
                  <a
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-black text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all group/btn"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Trang web
                  </a>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary/40 uppercase tracking-wider cursor-not-allowed">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Trang web
                  </div>
                )}

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}
