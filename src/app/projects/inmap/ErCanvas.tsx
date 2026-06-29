"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, RotateCcw, X, Database } from "lucide-react";
import { COLLECTIONS, RELATIONS, CATEGORY_STYLE, type Collection } from "./schema";

const NODE_W = 240;
const NODE_H = 66;
const CANVAS_W = 1560;
const CANVAS_H = 1080;

type Pos = { x: number; y: number };

function initialPositions(): Record<string, Pos> {
  const p: Record<string, Pos> = {};
  for (const c of COLLECTIONS) p[c.id] = { x: c.x, y: c.y };
  return p;
}

export default function ErCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Record<string, Pos>>(initialPositions);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.82);

  const dragRef = useRef<{ id: string; offX: number; offY: number; moved: boolean } | null>(null);
  const panRef = useRef<{ sx: number; sy: number; sl: number; st: number; moved: boolean } | null>(null);

  const toCanvasCoord = useCallback(
    (clientX: number, clientY: number): Pos => {
      const rect = canvasRef.current!.getBoundingClientRect();
      return { x: (clientX - rect.left) / zoom, y: (clientY - rect.top) / zoom };
    },
    [zoom]
  );

  // Background pointer down: bắt đầu pan vùng nhìn
  const onCanvasPointerDown = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const vp = viewportRef.current!;
    panRef.current = { sx: e.clientX, sy: e.clientY, sl: vp.scrollLeft, st: vp.scrollTop, moved: false };
  };

  const onNodePointerDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const c = toCanvasCoord(e.clientX, e.clientY);
    const pos = positions[id];
    dragRef.current = { id, offX: c.x - pos.x, offY: c.y - pos.y, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    // Pan
    const p = panRef.current;
    if (p) {
      const vp = viewportRef.current!;
      vp.scrollLeft = p.sl - (e.clientX - p.sx);
      vp.scrollTop = p.st - (e.clientY - p.sy);
      if (Math.abs(e.clientX - p.sx) + Math.abs(e.clientY - p.sy) > 3) p.moved = true;
      return;
    }
    // Drag node
    const d = dragRef.current;
    if (!d) return;
    const c = toCanvasCoord(e.clientX, e.clientY);
    d.moved = true;
    setPositions((prev) => ({
      ...prev,
      [d.id]: {
        x: Math.max(0, Math.min(CANVAS_W - NODE_W, c.x - d.offX)),
        y: Math.max(0, Math.min(CANVAS_H - NODE_H, c.y - d.offY)),
      },
    }));
  };

  const onPointerUp = () => {
    const p = panRef.current;
    if (p) {
      if (!p.moved) setSelectedId(null);
      panRef.current = null;
      return;
    }
    const d = dragRef.current;
    if (d && !d.moved) setSelectedId((cur) => (cur === d.id ? null : d.id));
    dragRef.current = null;
  };

  const nodeCenter = (id: string) => {
    const p = positions[id];
    return { x: p.x + NODE_W / 2, y: p.y + NODE_H / 2 };
  };

  // Returns the point on the border of nodeId's rectangle facing targetId
  const borderPoint = (nodeId: string, targetId: string) => {
    const p = positions[nodeId];
    const nc = nodeCenter(nodeId);
    const tc = nodeCenter(targetId);
    const dx = tc.x - nc.x, dy = tc.y - nc.y;
    if (Math.abs(dx) < 1e-9 && Math.abs(dy) < 1e-9) return nc;
    const ts: number[] = [];
    if (Math.abs(dx) > 1e-9) {
      const tL = (p.x - nc.x) / dx;
      if (tL > 1e-9 && nc.y + tL * dy >= p.y && nc.y + tL * dy <= p.y + NODE_H) ts.push(tL);
      const tR = (p.x + NODE_W - nc.x) / dx;
      if (tR > 1e-9 && nc.y + tR * dy >= p.y && nc.y + tR * dy <= p.y + NODE_H) ts.push(tR);
    }
    if (Math.abs(dy) > 1e-9) {
      const tT = (p.y - nc.y) / dy;
      if (tT > 1e-9 && nc.x + tT * dx >= p.x && nc.x + tT * dx <= p.x + NODE_W) ts.push(tT);
      const tB = (p.y + NODE_H - nc.y) / dy;
      if (tB > 1e-9 && nc.x + tB * dx >= p.x && nc.x + tB * dx <= p.x + NODE_W) ts.push(tB);
    }
    if (ts.length === 0) return nc;
    const t = Math.min(...ts);
    return { x: nc.x + t * dx, y: nc.y + t * dy };
  };

  // Helper: get border endpoints for a relation
  const relEndpoints = (fromId: string, toId: string) => {
    const bp1 = borderPoint(fromId, toId);
    const bp2 = borderPoint(toId, fromId);
    return { x1: bp1.x, y1: bp1.y, x2: bp2.x, y2: bp2.y };
  };

  // Helper: get cardinality label position offset outside the card border
  const CARD_LABEL_OFFSET = 18;
  const cardLabelPos = (bx: number, by: number, tx: number, ty: number) => {
    const dx = tx - bx, dy = ty - by;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 1e-9) return { x: bx, y: by };
    return { x: bx + (dx / len) * CARD_LABEL_OFFSET, y: by + (dy / len) * CARD_LABEL_OFFSET };
  };

  const anyFocus = hoverId ?? selectedId;
  const isActive = (rel: { from: string; to: string }) =>
    anyFocus != null && (rel.from === anyFocus || rel.to === anyFocus);

  const selected: Collection | undefined = COLLECTIONS.find((c) => c.id === selectedId);

  return (
    <div className="relative w-full h-full rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: "radial-gradient(circle at 50% 38%, #18233d 0%, #0e1526 60%, #0b1120 100%)" }}>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-3 border-b border-white/5 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <Database className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-sm font-bold text-cyan-300 shrink-0">InMap Database Schema</span>
          <span className="hidden sm:inline text-[11px] text-gray-500 truncate">
            Interactive ER Visualizer (Click vào table để xem chi tiết)
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(2)))}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all" title="Phóng to">
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))}
            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all" title="Thu nhỏ">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => { setPositions(initialPositions()); setZoom(0.82); setSelectedId(null); }}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-white/5 border border-white/10 text-[11px] font-semibold text-gray-400 hover:text-white hover:bg-white/10 transition-all" title="Đặt lại bố cục">
            <RotateCcw className="w-3 h-3" />
            Reset Layout
          </button>
        </div>
      </div>

      {/* Scrollable viewport */}
      <div ref={viewportRef} className="absolute inset-0 top-[49px] overflow-auto cursor-grab active:cursor-grabbing">
        <div
          ref={canvasRef}
          onPointerMove={onPointerMove}
          onPointerDown={onCanvasPointerDown}
          onPointerUp={onPointerUp}
          className="relative"
          style={{ width: CANVAS_W * zoom, height: CANVAS_H * zoom }}
        >
          <div className="absolute top-0 left-0"
            style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${zoom})`, transformOrigin: "top left" }}>

            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.05]">
              <defs>
                <pattern id="ergrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#a9b6cf" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ergrid)" />
            </svg>

            {/* ── Layer 1: đường nối (dưới nodes) ── */}
            <svg className="absolute inset-0" width={CANVAS_W} height={CANVAS_H} style={{ pointerEvents: "none" }}>
              <defs>
                <filter id="lineGlow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur stdDeviation="4.5" />
                </filter>
              </defs>
              {/* inactive */}
              {RELATIONS.map((rel, i) => {
                if (isActive(rel)) return null;
                const ep = relEndpoints(rel.from, rel.to);
                return (
                  <line key={`d-${i}`} x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2}
                    stroke="#46546e" strokeWidth={1.25} strokeDasharray="5,6" opacity={anyFocus != null ? 0.35 : 0.7} />
                );
              })}
              {/* active glow + sharp */}
              {RELATIONS.map((rel, i) => {
                if (!isActive(rel)) return null;
                const ep = relEndpoints(rel.from, rel.to);
                const stroke = CATEGORY_STYLE[COLLECTIONS.find((c) => c.id === rel.from)!.category].stroke;
                return (
                  <g key={`a-${i}`}>
                    <line x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2} stroke={stroke} strokeWidth={7} opacity={0.5} filter="url(#lineGlow)" />
                    <line x1={ep.x1} y1={ep.y1} x2={ep.x2} y2={ep.y2} stroke={stroke} strokeWidth={2.5} />
                  </g>
                );
              })}
            </svg>

            {/* ── Layer 2: Nodes ── */}
            {COLLECTIONS.map((c) => {
              const style = CATEGORY_STYLE[c.category];
              const stroke = style.stroke;
              const pos = positions[c.id];
              const focused = anyFocus === c.id;
              const connected = anyFocus != null && RELATIONS.some(
                (r) => (r.from === anyFocus && r.to === c.id) || (r.to === anyFocus && r.from === c.id)
              );
              const dim = anyFocus != null && !focused && !connected;
              const isSelected = selectedId === c.id;

              return (
                <div
                  key={c.id}
                  onPointerDown={(e) => onNodePointerDown(e, c.id)}
                  onMouseEnter={() => setHoverId(c.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className="absolute select-none rounded-2xl border-2 transition-[opacity,transform] duration-150 cursor-grab active:cursor-grabbing"
                  style={{
                    left: pos.x, top: pos.y, width: NODE_W,
                    background: "linear-gradient(155deg, #1c2740 0%, #121a2c 100%)",
                    borderColor: focused || isSelected ? stroke : `${stroke}45`,
                    boxShadow: focused || isSelected
                      ? `0 0 0 1px ${stroke}, 0 0 26px ${stroke}66, 0 8px 24px rgba(0,0,0,0.5)`
                      : "0 6px 18px rgba(0,0,0,0.4)",
                    opacity: dim ? 0.34 : 1,
                    transform: focused ? "scale(1.03)" : "scale(1)",
                    zIndex: focused || isSelected ? 10 : 2,
                  }}
                >
                  <div className="px-4 py-3">
                    <div className="text-[10px] font-bold tracking-[0.12em] uppercase" style={{ color: stroke }}>
                      <span className="opacity-70">{c.category}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 mt-1.5">
                      <span className="text-[14px] font-extrabold text-white font-mono leading-tight break-all">{c.label}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.06] text-gray-300 border border-white/10 shrink-0">
                        {c.tag}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ── Layer 3: nhãn quan hệ + cardinality (TRÊN nodes) ── */}
            <svg className="absolute inset-0" width={CANVAS_W} height={CANVAS_H} style={{ pointerEvents: "none", zIndex: 12 }}>
              {RELATIONS.map((rel, i) => {
                const ep = relEndpoints(rel.from, rel.to);
                const active = isActive(rel);
                const dimAll = anyFocus != null && !active;
                const mx = (ep.x1 + ep.x2) / 2, my = (ep.y1 + ep.y2) / 2;
                // Cardinality labels positioned just outside the card border
                const fp = cardLabelPos(ep.x1, ep.y1, ep.x2, ep.y2);
                const tp = cardLabelPos(ep.x2, ep.y2, ep.x1, ep.y1);
                const stroke = CATEGORY_STYLE[COLLECTIONS.find((c) => c.id === rel.from)!.category].stroke;
                const labelW = rel.label.length * 6.4 + 16;

                if (active) {
                  return (
                    <g key={`l-${i}`}>
                      {[{ p: fp, c: rel.fromCard }, { p: tp, c: rel.toCard }].map((cd, k) => {
                        const w = cd.c.length * 7 + 12;
                        return (
                          <g key={k}>
                            <rect x={cd.p.x - w / 2} y={cd.p.y - 10} width={w} height={20} rx={5} fill={stroke} />
                            <text x={cd.p.x} y={cd.p.y + 4} fill="#0a0a0a" fontSize="11" fontWeight="800" textAnchor="middle">{cd.c}</text>
                          </g>
                        );
                      })}
                      <rect x={mx - labelW / 2} y={my - 10} width={labelW} height={20} rx={10} fill="#0b1220" stroke={stroke} strokeWidth={1.25} />
                      <text x={mx} y={my + 3.5} fill={stroke} fontSize="9.5" fontWeight="800" letterSpacing="0.06em" textAnchor="middle">{rel.label}</text>
                    </g>
                  );
                }
                return (
                  <g key={`l-${i}`} opacity={dimAll ? 0.4 : 0.95}>
                    {/* nền tối nhỏ phía sau chữ để không bị chìm */}
                    <rect x={mx - labelW / 2} y={my - 9} width={labelW} height={17} rx={4} fill="#0d1422" opacity={0.85} />
                    <text x={mx} y={my + 3} fill="#74829c" fontSize="9.5" fontWeight="700" letterSpacing="0.06em" textAnchor="middle">{rel.label}</text>
                    <g>
                      <circle cx={fp.x} cy={fp.y} r={8} fill="#0d1422" />
                      <text x={fp.x} y={fp.y + 3.5} fill="#7b89a3" fontSize="10" fontWeight="700" textAnchor="middle">{rel.fromCard}</text>
                      <circle cx={tp.x} cy={tp.y} r={8} fill="#0d1422" />
                      <text x={tp.x} y={tp.y + 3.5} fill="#7b89a3" fontSize="10" fontWeight="700" textAnchor="middle">{rel.toCard}</text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap gap-x-3 gap-y-1 max-w-[60%] bg-black/40 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/5">
        {Object.entries(CATEGORY_STYLE).map(([cat, st]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: st.stroke }} />
            <span className="text-[9px] text-gray-500 font-medium">{cat}</span>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute top-[49px] right-0 bottom-0 w-[340px] z-30 bg-[#0a0f1a]/95 backdrop-blur-md border-l border-white/10 overflow-y-auto"
          >
            {(() => {
              const style = CATEGORY_STYLE[selected.category];
              return (
                <div className="p-5 flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[9px] font-bold tracking-[0.15em] uppercase" style={{ color: style.stroke }}>{selected.category}</div>
                      <h3 className="text-base font-bold text-[#E1E0CC] font-mono mt-0.5 break-all">{selected.label}</h3>
                    </div>
                    <button onClick={() => setSelectedId(null)}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white shrink-0 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className={`rounded-xl border ${style.border} ${style.chipBg} p-3`}>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Mục đích / Vai trò</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{selected.purpose}</p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Key Connections</p>
                    <ul className="flex flex-col gap-1.5">
                      {selected.keyConnections.map((k, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                          <span className={`${style.text} mt-0.5 shrink-0`}>•</span>{k}
                        </li>
                      ))}
                    </ul>
                    <span className={`inline-block mt-2.5 text-[9px] font-bold px-2 py-1 rounded ${style.chipBg} ${style.text} uppercase tracking-wider`}>
                      {selected.tag}
                    </span>
                  </div>

                  <div>
                    <div className="grid grid-cols-[1fr_auto] gap-x-3 px-1 pb-2 mb-1 border-b border-white/10">
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Field</span>
                      <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Type</span>
                    </div>
                    <div className="flex flex-col">
                      {selected.fields.map((f) => (
                        <div key={f.name} className="py-2 px-1 border-b border-white/5 last:border-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-mono font-semibold text-cyan-300">{f.name}</span>
                            <span className="text-[10px] font-mono italic text-purple-400/80 shrink-0">{f.type}</span>
                          </div>
                          <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{f.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
