/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client";

import { motion } from "motion/react";
import { Radar } from "lucide-react";

export interface RadarSource {
  key: string;
  label: string;
  count: number;
  color: string;
}

interface DataRadarProps {
  sources: RadarSource[];
  online: number;
  total: number;
  updatedAt?: string;
  nextScan?: string;
}

const RINGS = [18, 32, 46];
const SPOKES = 8;

export function DataRadar({ sources, online, total, updatedAt, nextScan }: DataRadarProps) {
  const totalCount = sources.reduce((sum, s) => sum + s.count, 0);
  const maxCount = Math.max(1, ...sources.map((s) => s.count));

  const positioned = sources.map((s, i) => {
    const angle = (-90 + (360 / sources.length) * i) * (Math.PI / 180);
    const radiusRatio = 0.32 + 0.55 * (s.count / maxCount);
    return {
      ...s,
      x: 50 + 42 * radiusRatio * Math.cos(angle),
      y: 50 + 42 * radiusRatio * Math.sin(angle),
      delay: i * 0.35,
    };
  });

  return (
    <div className="bg-[#101010] border border-white/5 rounded-2xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radar className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-[#E1E0CC] uppercase tracking-wider">Radar Nguồn Dữ Liệu</span>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${online === total ? "text-green-400" : "text-yellow-400"}`}>
          {online}/{total} trực tuyến
        </span>
      </div>

      <div className="relative w-full aspect-square max-w-[220px] mx-auto my-2">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
          {RINGS.map((r) => (
            <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          ))}
          {Array.from({ length: SPOKES }).map((_, i) => {
            const angle = (i * (360 / SPOKES)) * (Math.PI / 180);
            return (
              <line
                key={i}
                x1="50" y1="50"
                x2={50 + 46 * Math.cos(angle)}
                y2={50 + 46 * Math.sin(angle)}
                stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"
              />
            );
          })}
        </svg>

        <motion.div
          className="absolute inset-1 rounded-full pointer-events-none"
          style={{ background: "conic-gradient(from 0deg, rgba(222,219,200,0.2), transparent 70deg)" }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-[#E1E0CC]">{totalCount}</span>
          <span className="text-[8px] text-gray-600 uppercase tracking-widest">mục mới</span>
        </div>

        {positioned.map((s) => (
          <motion.div
            key={s.key}
            className="absolute w-2.5 h-2.5 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${s.x}%`, top: `${s.y}%`, backgroundColor: s.color }}
            animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 2.5, delay: s.delay }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        {sources.map((s) => (
          <div key={s.key} className="flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-gray-400 truncate">{s.label}</span>
            </div>
            <span className="text-gray-600 shrink-0">{s.count} mục</span>
          </div>
        ))}
      </div>

      {(updatedAt || nextScan) && (
        <div className="flex items-center justify-between text-[9px] text-gray-700 mt-3 pt-3 border-t border-white/5">
          {updatedAt && <span>Cập nhật {updatedAt}</span>}
          {nextScan && <span>Quét tiếp theo {nextScan}</span>}
        </div>
      )}
    </div>
  );
}
