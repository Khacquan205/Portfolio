"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    GraphViewer?: { processElements: () => void };
  }
}

const VIEWER_SCRIPT_SRC = "https://viewer.diagrams.net/js/viewer-static.min.js";

export default function ArchitectureDiagram() {
  const [xml, setXml] = useState<string | null>(null);

  useEffect(() => {
    fetch("/projects/inmap/architecture-diagram.xml")
      .then((r) => r.text())
      .then(setXml)
      .catch(() => setXml(null));
  }, []);

  useEffect(() => {
    if (!xml) return;
    if (window.GraphViewer) {
      window.GraphViewer.processElements();
      return;
    }
    const script = document.createElement("script");
    script.src = VIEWER_SCRIPT_SRC;
    script.async = true;
    script.onload = () => window.GraphViewer?.processElements();
    document.body.appendChild(script);
  }, [xml]);

  if (!xml) {
    return (
      <div className="flex items-center justify-center gap-3 py-12 text-xs text-gray-600 rounded-xl border border-white/5 bg-white/[0.02]">
        <span className="w-4 h-4 rounded-full border-2 animate-spin border-cyan-400/30 border-t-cyan-400" />
        Đang tải sơ đồ kiến trúc...
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-white p-2">
      <div
        className="mxgraph"
        style={{ maxWidth: "100%" }}
        data-mxgraph={JSON.stringify({
          highlight: "#22d3ee",
          nav: true,
          resize: true,
          toolbar: "zoom lightbox",
          xml,
        })}
      />
    </div>
  );
}
