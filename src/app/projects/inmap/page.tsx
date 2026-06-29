"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard, Database, CreditCard, BookOpen, ClipboardList,
  ArrowLeft, ChevronRight,
  GitBranch, Users, Calendar, CheckSquare,
  type LucideIcon,
} from "lucide-react";
import ErCanvas from "./ErCanvas";
import PaymentCanvas from "./PaymentCanvas";
import ArchitectureDiagram from "./ArchitectureDiagram";

const SESSION_KEY = "docs_authed";

type SectionId = "overview" | "er-main" | "er-payment" | "technical" | "mentor";

const NAV_ITEMS: { id: SectionId; label: string; icon: LucideIcon }[] = [
  { id: "overview",   label: "Tổng quan",                icon: LayoutDashboard },
  { id: "er-main",    label: "Sơ đồ Cơ sở Dữ liệu",     icon: Database        },
  { id: "er-payment", label: "Sơ đồ Cổng Thanh toán",   icon: CreditCard      },
  { id: "technical",  label: "Tài liệu Kỹ thuật",        icon: BookOpen        },
  { id: "mentor",     label: "Nhật ký Họp Mentor",        icon: ClipboardList   },
];

// ─── Section: Tổng quan ──────────────────────────────────────────────────────
function OverviewSection({ setActive }: { setActive: (id: SectionId) => void }) {
  const stats = [
    { label: "Collections",      value: "16",  icon: Database,   color: "text-blue-400",   bg: "bg-blue-500/10",   border: "border-blue-500/20"   },
    { label: "API Endpoints",    value: "42",  icon: GitBranch,  color: "text-cyan-400",   bg: "bg-cyan-500/10",   border: "border-cyan-500/20"   },
    { label: "Chương tài liệu",  value: "6",   icon: BookOpen,   color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Buổi họp Mentor",  value: "8",   icon: Users,      color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  ];

  const quickLinks: { id: SectionId; label: string; desc: string; color: string }[] = [
    { id: "er-main",    label: "Sơ đồ CSDL",           desc: "16 collection · ERD tương tác",     color: "border-blue-500/30 hover:border-blue-500/60"   },
    { id: "er-payment", label: "Cổng Thanh toán",       desc: "Payment Service v2 · 5 collection", color: "border-cyan-500/30 hover:border-cyan-500/60"   },
    { id: "technical",  label: "Tài liệu Kỹ thuật",    desc: "6 chương · Thuật toán đồ thị",      color: "border-purple-500/30 hover:border-purple-500/60"},
    { id: "mentor",     label: "Nhật ký Họp",           desc: "8 buổi · Task tracking",            color: "border-orange-500/30 hover:border-orange-500/60"},
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">Indoor Navigation</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#E1E0CC] mt-1">InMap Project Hub</h1>
        <p className="text-sm text-gray-500 mt-2 max-w-xl leading-relaxed">
          Hệ thống định vị &amp; chỉ đường trong nhà thông minh. Truy cập nhanh các tài liệu kỹ thuật, sơ đồ cơ sở dữ liệu và nhật ký phát triển.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`flex flex-col gap-3 p-4 rounded-2xl bg-white/[0.02] border ${s.border}`}>
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-gray-600 mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick access */}
      <div>
        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Truy cập nhanh</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((q) => (
            <button
              key={q.id}
              onClick={() => setActive(q.id)}
              className={`flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border ${q.color} transition-all group text-left`}
            >
              <div>
                <p className="text-sm font-semibold text-[#E1E0CC] group-hover:text-white transition-colors">{q.label}</p>
                <p className="text-[11px] text-gray-600 mt-0.5">{q.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-700 group-hover:text-gray-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div>
        <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mb-3">Tech Stack</p>
        <div className="flex flex-wrap gap-2">
          {["MongoDB", "Node.js", "Express", "Graph Algorithm", "Dijkstra", "A*", "WebSocket", "JWT", "Redis"].map((t) => (
            <span key={t} className="text-[11px] font-semibold text-cyan-400/70 bg-cyan-400/5 border border-cyan-400/10 rounded-full px-3 py-1">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ErPaymentSection is now replaced by the full PaymentCanvas interactive visualizer

// ─── Section: Tài liệu Kỹ thuật ──────────────────────────────────────────────

type TechSubId = "architecture" | "mainflow" | "functional";

const TECH_SUB_ITEMS: { id: TechSubId; label: string }[] = [
  { id: "architecture", label: "System Architecture"     },
  { id: "mainflow",     label: "Main Flow"               },
  { id: "functional",   label: "Functional Requirements" },
];

const DOC_HEX: Record<TechSubId, string> = {
  architecture: "#22d3ee",
  mainflow:     "#34d399",
  functional:   "#c084fc",
};

type DocSection = { heading: string; body: string };

const DOC_CONTENT: Record<TechSubId, DocSection[]> = {
  architecture: [
    { heading: "Kiến trúc tổng quan — 3 Microservices", body: "InMap được chia thành 3 microservice độc lập: IAM Service (MongoDB · xác thực & phân quyền), InMap Service (MongoDB · bản đồ & điều hướng), Payment Service (PostgreSQL · thanh toán & billing). Mỗi service có database riêng biệt và giao tiếp qua REST API." },
    { heading: "IAM Service", body: "Quản lý danh tính và phân quyền toàn cục (RBAC). Tích hợp Keycloak làm Identity Provider. Lưu trữ users, user_building_roles, organizations, buildings trong MongoDB inmap-iam-db (port 27017). Cung cấp JWT token cho toàn hệ thống." },
    { heading: "InMap Service", body: "Core service xử lý bản đồ trong nhà, định vị và tìm đường. Chứa 12 collection MongoDB: floors, spaces, space_boundaries, nodes, edges, connectors, pois, categories, located_features, feature_libraries, scheduled_blockages, search_logs. Thuật toán A* / Dijkstra chạy trực tiếp trên đồ thị nodes–edges." },
    { heading: "Payment Service", body: "Quản lý vòng đời thanh toán SaaS. Sử dụng PostgreSQL 15 (port 5433) với 4 bảng: plans, subscriptions, invoices, transactions. Webhook gửi sự kiện qua bảng webhook_logs. Tích hợp cổng thanh toán bên thứ ba (Stripe / PayOS)." },
    { heading: "Luồng giao tiếp", body: "Client → API Gateway → Service tương ứng. IAM Service xác thực JWT trước mọi request. InMap Service & Payment Service giao tiếp nội bộ qua REST. WebSocket dùng cho real-time map update. Redis cache session và kết quả routing." },
  ],
  mainflow: [
    { heading: "MAINFLOW 1: LUỒNG TÌM KIẾM VÀ ĐIỀU HƯỚNG (DÀNH CHO KHÁCH VÃNG LAI - GUEST)", body: "Khách vãng lai khởi tạo vị trí qua 3 cách: (1) Kiosk tự động định vị — vị trí xuất phát \"Bạn đang ở đây\" được khóa sẵn. (2) Quét mã QR tại hành lang/thang máy — điện thoại tự mở bản đồ và định vị chính xác. (3) Chọn trực tiếp trên Web/Mobile từ xa. Hệ thống kiểm tra trạng thái địa điểm → hiển thị tùy chọn lộ trình (thang máy/cuốn/bộ) → vẽ đường 3D + danh sách chỉ dẫn từng bước. Góc nhìn 3D tự động xoay khi bấm vào từng bước." },
    { heading: "MAINFLOW 2: LUỒNG QUẢN TRỊ DỮ LIỆU & XÂY DỰNG BẢN ĐỒ (QUẢN LÝ TÒA NHÀ)", body: "Subflow 1 — AI Generation: Manager tải ảnh sơ đồ 2D → AI nhận diện tường/cửa/phòng → hệ thống tự dựng hình 3D và sinh nodes/edges. Subflow 2 — Manual Editor: Chọn tầng cần sửa → kéo-thả điểm neo chỉnh khối phòng → đặt tên phòng → thả ghim POI → Preview 3D → Publish. Bản đồ cập nhật ngay lập tức trên Kiosk và mobile." },
    { heading: "MAINFLOW 3: LUỒNG BẢO TRÌ VÀ VÔ HIỆU HÓA TUYẾN ĐƯỜNG (SCHEDULE INACTIVE)", body: "Manager chọn khu vực/thiết bị cần bảo trì trên bản đồ → nhập khung giờ đóng cửa → hệ thống ghi lịch hẹn. Trong thời gian bảo trì, khách vãng lai tìm đường qua khu vực đó sẽ được hệ thống tự động tính lại lộ trình ngắn nhất thay thế, bỏ qua đoạn đường đang đóng." },
    { heading: "MAINFLOW 4: LUỒNG PHÂN TÍCH DỮ LIỆU VÀ BÁO CÁO (ANALYTICS)", body: "Hệ thống tự động ghi nhận ẩn danh mỗi lần tìm đường (phòng nào, từ đâu, lúc mấy giờ). Phân loại thành: Hotspot (phòng được tìm nhiều nhất) và Missed Searches (từ khóa không ra kết quả). Dashboard hiển thị biểu đồ cột, tròn và Heatmap mật độ di chuyển theo khu vực." },
    { heading: "MAINFLOW 5: LUỒNG QUẢN LÝ TÀI KHOẢN, PHÂN QUYỀN VÀ THANH TOÁN (RBAC & PAYMENT)", body: "3 cấp tài khoản: Building Owner (mua gói, xem tài chính, tạo tài khoản cấp dưới) → Building Manager (chỉ sửa bản đồ tòa nhà được giao, không thấy tài chính) → System Admin (vận hành kỹ thuật toàn nền tảng). Subflow thanh toán: Chọn gói → Cổng thanh toán → Thành công: hóa đơn + kích hoạt gói / Thất bại: thông báo lý do." },
  ],
  functional: [
    { heading: "TỔNG QUAN HỆ THỐNG & ĐỐI TƯỢNG SỬ DỤNG (ACTORS)", body: "InMap là nền tảng bản đồ trong nhà SaaS phục vụ 4 nhóm: SaaS Super Admin — kiểm soát toàn bộ tài nguyên & khách hàng doanh nghiệp. Tenant Admin (building_owner) — chủ đầu tư, quản lý cấu hình tổ chức. Facility Staff (building_manager) — số hóa bản đồ, cập nhật không gian. End-User / Guest — khách tham quan tìm đường." },
    { heading: "MODULE QUẢN TRỊ NỀN TẢNG SAAS (ADMIN)", body: "FR-SaaS-01: Quản lý tổ chức khách hàng (thêm/sửa/khóa). Mỗi khách hàng gắn subdomain duy nhất và gói dịch vụ. FR-SaaS-02: Tạo tài khoản Building Owner cho từng tổ chức. FR-SaaS-03: Giám sát tài nguyên toàn cục — danh sách tòa nhà, lượng truy cập, trạng thái vận hành. FR-SaaS-04: Cấu hình nâng cao nền tảng." },
    { heading: "MODULE QUẢN LÝ TÀI KHOẢN & PHÂN QUYỀN DOANH NGHIỆP (BUILDING OWNER)", body: "FR-OWN-01: Khai báo và quản lý tòa nhà (tạo mới, cập nhật tên/địa chỉ). Dữ liệu tự động giới hạn trong tổ chức. FR-OWN-02: Quản lý nhân sự — tạo tài khoản Building Manager và cấp quyền. FR-OWN-03: Phân quyền theo khu vực — giới hạn Manager chỉ thấy/sửa được tòa nhà được giao." },
    { heading: "MODULE BIÊN TẬP & QUẢN LÝ BẢN ĐỒ CMS (BUILDING MANAGER & OWNER)", body: "FR-CMS-01: Quản lý danh sách tầng (số tầng phân biệt). FR-CMS-02: Nhập sơ đồ + AI tự động số hóa. FR-CMS-03: Chỉnh sửa 2D tương tác (kéo điểm neo thay đổi hình dạng phòng). FR-CMS-04: Tự động sinh mạng lưới nodes/edges khi lưu. FR-CMS-05: Quản lý phiên bản Draft → Publish. FR-CMS-06: Thiết lập POI. FR-CMS-07: Quản lý Connector liên tầng. FR-CMS-08: Lập lịch chặn đường bảo trì." },
    { heading: "MODULE TÌM ĐƯỜNG & BẢN ĐỒ TƯƠNG TÁC (END-USER / GUEST)", body: "FR-USER-01: Bản đồ 3D tương tác (zoom, xoay, dịch chuyển). FR-USER-02: Bộ lọc và chuyển đổi tầng. FR-USER-03: Smart Labels. FR-USER-04: Tra cứu địa điểm. FR-USER-05: Xác định vị trí qua click hoặc quét QR. FR-USER-06: Local Routing (cùng tầng). FR-USER-07: Multi-floor Routing (liên tầng, hướng dẫn đổi thang). FR-USER-08: Hướng dẫn từng bước kèm ước tính khoảng cách/thời gian. FR-USER-09: Accessibility Mode." },
  ],
};

function MarkdownViewer({ content, hex }: { content: string; hex: string }) {
  const lines = content.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  function unescape(text: string) {
    return text.replace(/\\([*\-.\[\]()#\\])/g, "$1");
  }
  function inline(text: string) {
    return unescape(text)
      .replace(/`([^`]+)`/g, '<code style="color:#67e8f9;background:rgba(255,255,255,0.06);padding:1px 5px;border-radius:3px;font-size:10px">$1</code>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#d1d5db;font-weight:600">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="color:#9ca3af">$1</em>');
  }

  while (i < lines.length) {
    const line = lines[i].trim();
    i++;
    if (!line) continue;
    if (/^!\[/.test(line)) {
      const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        nodes.push(
          <img key={i} src={imgMatch[2]} alt={imgMatch[1]}
            className="w-full rounded-xl my-4 border border-white/10 object-contain" />
        );
      }
      continue;
    }

    if (/^#\s/.test(line)) {
      const text = unescape(line.replace(/^#\s+/, "").replace(/\*\*/g, ""));
      nodes.push(<h1 key={i} className="text-xl font-bold text-[#E1E0CC] mb-5 pb-3 border-b border-white/10">{text}</h1>);
      continue;
    }

    if (/^##\s/.test(line) && !/^###/.test(line)) {
      const text = unescape(line.replace(/^#+\s*/, "").replace(/\*\*/g, ""));
      nodes.push(
        <div key={i} className="mt-6 first:mt-0 mb-2 px-4 py-3.5 rounded-xl"
          style={{ background: `${hex}28`, borderLeft: `4px solid ${hex}` }}>
          <p className="text-[13px] font-black uppercase tracking-wider leading-snug" style={{ color: hex }}>{text}</p>
        </div>
      );
      continue;
    }

    if (/^###/.test(line)) {
      const text = unescape(line.replace(/^#+\s*/, "").replace(/\*\*/g, ""));
      nodes.push(
        <div key={i} className="mt-4 mb-1.5 px-3 py-2 rounded-lg border border-white/10"
          style={{ background: `${hex}18` }}>
          <p className="text-[12px] font-bold uppercase tracking-wide" style={{ color: `${hex}cc` }}>{text}</p>
        </div>
      );
      continue;
    }

    if (/^\*\s/.test(line)) {
      const bullets: string[] = [line.replace(/^\*\s+/, "")];
      while (i < lines.length && /^\*\s/.test(lines[i].trim())) {
        bullets.push(lines[i].trim().replace(/^\*\s+/, ""));
        i++;
      }
      nodes.push(
        <ul key={i} className="mb-3 flex flex-col gap-2">
          {bullets.map((b, bi) => (
            <li key={bi} className="flex items-start gap-2.5">
              <span className="mt-[6px] shrink-0 inline-block w-1.5 h-1.5 rounded-full" style={{ background: hex, opacity: 0.7, flexShrink: 0 }} />
              <span className="text-[13px] text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: inline(b) }} />
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (line.startsWith("**") && line.endsWith("**") && line.length > 4) {
      const text = unescape(line.slice(2, -2));
      nodes.push(
        <div key={i} className="mt-3 mb-1.5 flex items-center">
          <span className="text-[12.5px] font-bold px-3 py-1.5 rounded-md"
            style={{ background: `${hex}2c`, color: hex, borderLeft: `3px solid ${hex}aa` }}>
            {text}
          </span>
        </div>
      );
      continue;
    }

    nodes.push(
      <p key={i} className="text-[13px] text-gray-300 leading-relaxed mb-2"
        dangerouslySetInnerHTML={{ __html: inline(line) }} />
    );
  }

  return <div className="flex flex-col">{nodes}</div>;
}

// ─── Section: Nhật ký Họp Mentor ─────────────────────────────────────────────
const meetings = [
  {
    date: "2026-01-08", session: 1,
    topics: ["Xác nhận đề tài InMap", "Phân tích yêu cầu hệ thống", "Phác thảo kiến trúc ban đầu"],
    tasks: ["Thiết kế ERD sơ bộ", "Setup môi trường Node.js + MongoDB"],
    status: "done",
  },
  {
    date: "2026-01-22", session: 2,
    topics: ["Review ERD lần 1", "Thảo luận thuật toán Dijkstra", "Góp ý cách xử lý multi-floor"],
    tasks: ["Cập nhật schema theo feedback", "Implement Dijkstra cơ bản"],
    status: "done",
  },
  {
    date: "2026-02-05", session: 3,
    topics: ["Demo pathfinding prototype", "Review API structure", "Thêm yêu cầu blockage detection"],
    tasks: ["Viết API reference", "Xử lý edge-case blockage"],
    status: "done",
  },
  {
    date: "2026-02-19", session: 4,
    topics: ["Review Payment Service thiết kế", "Thảo luận webhook handling", "Góp ý về rate limiting"],
    tasks: ["Implement Payment collections", "Viết tài liệu chương 4"],
    status: "done",
  },
  {
    date: "2026-03-05", session: 5,
    topics: ["Review chương 1–3 tài liệu", "Kiểm tra độ phủ test cases", "Định hướng deploy strategy"],
    tasks: ["Bổ sung chương 5–6", "Setup Docker Compose"],
    status: "done",
  },
  {
    date: "2026-03-19", session: 6,
    topics: ["Demo toàn bộ hệ thống", "Kiểm tra performance indoor navigation", "Phản hồi về UI visualizer"],
    tasks: ["Tối ưu Dijkstra với heuristic", "Cải thiện ERD visualizer"],
    status: "done",
  },
  {
    date: "2026-04-02", session: 7,
    topics: ["Review tài liệu hoàn chỉnh", "Kiểm tra consistency toàn bộ API", "Chuẩn bị báo cáo"],
    tasks: ["Hoàn thiện tài liệu", "Viết presentation slides"],
    status: "done",
  },
  {
    date: "2026-04-16", session: 8,
    topics: ["Buổi họp cuối — tổng kết", "Định hướng mở rộng hệ thống", "Feedback tổng thể"],
    tasks: ["Nộp báo cáo cuối kỳ", "Archive source code"],
    status: "done",
  },
];

function MentorSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold text-[#E1E0CC]">Nhật ký Họp Mentor</h2>
        <p className="text-sm text-gray-500 mt-1">
          8 buổi · Giảng viên hướng dẫn: <span className="text-orange-400/80">Thầy Sang</span>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {meetings.map((m, i) => (
          <div key={i} className={`rounded-xl border transition-all overflow-hidden ${open === i ? "border-orange-500/30 bg-orange-500/5" : "border-white/5 bg-white/[0.02] hover:border-orange-500/15"}`}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center gap-4 px-4 py-3 text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#E1E0CC]">Buổi {m.session}</span>
                  <span className="text-[10px] text-gray-600">{m.date}</span>
                </div>
                <p className="text-[11px] text-gray-600 truncate mt-0.5">{m.topics[0]}</p>
              </div>
              <span className="text-[9px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full shrink-0">
                Hoàn thành
              </span>
              <ChevronRight className={`w-4 h-4 text-gray-700 transition-transform shrink-0 ${open === i ? "rotate-90" : ""}`} />
            </button>

            {open === i && (
              <div className="px-4 pb-4 flex flex-col gap-3 border-t border-white/5 pt-3">
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Nội dung thảo luận</p>
                  <ul className="flex flex-col gap-1">
                    {m.topics.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-gray-400">
                        <span className="text-orange-400 mt-0.5 shrink-0">›</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Tasks được giao</p>
                  <ul className="flex flex-col gap-1">
                    {m.tasks.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-gray-400">
                        <CheckSquare className="w-3 h-3 text-green-400 mt-0.5 shrink-0" /> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────
export default function InMapDocsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<SectionId>("overview");
  const [techSub, setTechSub] = useState<TechSubId>("architecture");
  const [mdContent, setMdContent] = useState<string>("");
  const [mdLoading, setMdLoading] = useState(false);

  useEffect(() => {
    if (active !== "technical" || techSub === "architecture") return;
    setMdLoading(true);
    setMdContent("");
    fetch(`/api/docs?slug=${techSub}`)
      .then((r) => r.text())
      .then((text) => { setMdContent(text); setMdLoading(false); })
      .catch(() => setMdLoading(false));
  }, [active, techSub]);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) !== "1") {
      const params = new URLSearchParams({ url: "/projects/inmap", project: "InMap — Indoor Navigation" });
      router.replace(`/projects/docs?${params.toString()}`);
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) return null;

  return (
    <div
      className="flex h-screen overflow-hidden text-[#E1E0CC]"
      style={{ background: "linear-gradient(135deg, #070c14 0%, #0a101e 100%)" }}
    >
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-white/5 bg-black/20">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-white/5">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-400/60">Indoor Navigation</span>
          <p className="text-sm font-bold text-[#E1E0CC] mt-0.5" style={{ fontStyle: "italic" }}>InMap Hub</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <div key={item.id}>
                <button
                  onClick={() => setActive(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-xs font-semibold ${
                    isActive
                      ? "bg-cyan-400/10 border border-cyan-400/20 text-cyan-300"
                      : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-cyan-400" : "text-gray-600"}`} />
                  <span className="leading-tight flex-1">{item.label}</span>
                  {item.id === "technical" && (
                    <ChevronRight className={`w-3 h-3 shrink-0 transition-transform ${isActive ? "rotate-90" : ""}`} />
                  )}
                </button>
                {item.id === "technical" && isActive && (
                  <div className="mt-1 ml-3 pl-4 border-l border-white/8 flex flex-col gap-0.5">
                    {TECH_SUB_ITEMS.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setTechSub(sub.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-semibold transition-all ${
                          techSub === sub.id ? "bg-white/5" : "text-gray-600 hover:text-gray-300"
                        }`}
                        style={techSub === sub.id ? { color: DOC_HEX[sub.id] } : {}}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Back */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={() => router.push("/projects")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Về Projects
          </button>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {active === "er-main" || active === "er-payment" ? (
          // ER / Payment Visualizer chiếm trọn không gian, có canvas riêng
          <div className="flex-1 p-4 min-h-0">
            {active === "er-main" ? <ErCanvas /> : <PaymentCanvas />}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-8 py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {active === "overview" && <OverviewSection setActive={setActive} />}
                  {active === "technical" && (
                    <div className="flex flex-col gap-6">
                      <div>
                        <h2 className="text-xl font-bold text-[#E1E0CC]">Tài liệu Kỹ thuật</h2>
                        <p className="text-sm mt-1" style={{ color: `${DOC_HEX[techSub]}99` }}>
                          {TECH_SUB_ITEMS.find((s) => s.id === techSub)?.label}
                        </p>
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={techSub}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.18 }}
                        >
                          {techSub === "architecture" ? (
                            <div className="flex flex-col gap-3">
                              <ArchitectureDiagram />
                              {DOC_CONTENT.architecture.map((sec, idx) => (
                                <div key={idx} className="rounded-xl border border-white/5 overflow-hidden"
                                  style={{ borderLeftWidth: 3, borderLeftColor: DOC_HEX.architecture, borderLeftStyle: "solid" }}>
                                  <div className="px-5 py-3.5 flex items-start gap-4" style={{ background: `${DOC_HEX.architecture}0d` }}>
                                    <span className="text-[11px] font-black min-w-[22px] h-[22px] rounded flex items-center justify-center shrink-0 mt-0.5"
                                      style={{ background: `${DOC_HEX.architecture}22`, color: DOC_HEX.architecture }}>
                                      {idx + 1}
                                    </span>
                                    <h3 className="text-sm font-bold text-[#d8d7c3] leading-snug">{sec.heading}</h3>
                                  </div>
                                  <div className="px-5 py-4" style={{ background: "rgba(255,255,255,0.01)" }}>
                                    <p className="text-xs text-gray-400 leading-relaxed">{sec.body}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : mdLoading ? (
                            <div className="flex items-center justify-center gap-3 py-16 text-xs text-gray-600">
                              <span className="w-4 h-4 rounded-full border-2 animate-spin"
                                style={{ borderColor: `${DOC_HEX[techSub]}44`, borderTopColor: DOC_HEX[techSub] }} />
                              Đang tải...
                            </div>
                          ) : (
                            <MarkdownViewer content={mdContent} hex={DOC_HEX[techSub]} />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}
                  {active === "mentor" && <MentorSection />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
