// PaymentSchema.ts — data cho Payment Gateway ER Visualizer

export type PaymentCategoryKey =
  | "BILLING ENGINE"
  | "PAYMENT ENGINE"
  | "AUDIT & SYNC";

export interface PaymentField {
  name: string;
  type: string;
  desc: string;
}

export interface PaymentCollection {
  id: string;
  label: string;
  category: PaymentCategoryKey;
  tag: string;
  purpose: string;
  keyConnections: string[];
  fields: PaymentField[];
  x: number;
  y: number;
}

export interface PaymentRelation {
  from: string;
  to: string;
  label: string;
  fromCard: string;
  toCard: string;
}

export const PAYMENT_CATEGORY_STYLE: Record<
  PaymentCategoryKey,
  { border: string; bar: string; text: string; chipBg: string; stroke: string }
> = {
  "BILLING ENGINE":  { border: "border-cyan-500/60",   bar: "bg-cyan-400",   text: "text-cyan-300",   chipBg: "bg-cyan-500/10",   stroke: "#22d3ee" },
  "PAYMENT ENGINE":  { border: "border-pink-500/60",    bar: "bg-pink-400",   text: "text-pink-300",   chipBg: "bg-pink-500/10",   stroke: "#f472b6" },
  "AUDIT & SYNC":    { border: "border-violet-500/60",  bar: "bg-violet-400", text: "text-violet-300", chipBg: "bg-violet-500/10", stroke: "#a78bfa" },
};

export const PAYMENT_COLLECTIONS: PaymentCollection[] = [
  {
    id: "organizations",
    label: "organizations",
    category: "BILLING ENGINE",
    tag: "Tenant",
    purpose: "Thực thể thuê bao gốc (Multi-Tenant). Mỗi doanh nghiệp đăng ký một gói dịch vụ (plan) thông qua hệ thống thanh toán. Khi đăng ký plan mới, một bản ghi subscriptions sẽ được tạo liên kết tới tổ chức này.",
    keyConnections: [
      "Subscribes to plans: một tổ chức chọn gói dịch vụ phù hợp.",
      "Has subscriptions: lịch sử và trạng thái đăng ký hiện tại.",
    ],
    fields: [
      { name: "_id",       type: "ObjectId", desc: "Khóa chính duy nhất của doanh nghiệp" },
      { name: "name",      type: "String",   desc: "Tên doanh nghiệp / tổ chức" },
      { name: "plan",      type: "String",   desc: "Gói đang sử dụng: 'FREE', 'BASIC', 'ENTERPRISE'" },
      { name: "createdAt", type: "Date",     desc: "Thời điểm đăng ký tổ chức" },
      { name: "updatedAt", type: "Date",     desc: "Thời điểm cập nhật gần nhất" },
    ],
    x: 60, y: 340,
  },
  {
    id: "plans",
    label: "plans",
    category: "BILLING ENGINE",
    tag: "Pricing",
    purpose: "Danh mục các gói dịch vụ SaaS được cung cấp. Mỗi plan xác định giới hạn tài nguyên (số toà nhà, số floors, API rate limit) và giá thuê hàng tháng. Được tham chiếu bởi subscriptions khi tổ chức đăng ký.",
    keyConnections: [
      "Governs subscriptions: quy định quyền hạn và giá gói.",
    ],
    fields: [
      { name: "_id",       type: "ObjectId", desc: "Khóa chính duy nhất của gói dịch vụ" },
      { name: "name",      type: "String",   desc: "Tên gói: 'Free', 'Basic', 'Enterprise'" },
      { name: "price",     type: "Number",   desc: "Giá thuê hàng tháng (USD)" },
      { name: "limits",    type: "Object",   desc: "Giới hạn tài nguyên: { buildings, floors, apiRpm }" },
      { name: "features",  type: "Array",    desc: "Danh sách tính năng được phép trong gói" },
      { name: "active",    type: "Boolean",  desc: "Trạng thái gói: true = đang bán" },
      { name: "createdAt", type: "Date",     desc: "Thời điểm tạo gói dịch vụ" },
    ],
    x: 390, y: 130,
  },
  {
    id: "subscriptions",
    label: "subscriptions",
    category: "BILLING ENGINE",
    tag: "State",
    purpose: "Ghi nhận trạng thái đăng ký hiện tại của mỗi tổ chức đối với một plan cụ thể. Theo dõi chu kỳ thanh toán (trial, active, past_due, cancelled). Khi hết hạn, hệ thống tự động tạo invoice mới.",
    keyConnections: [
      "Linked to organizations: một tổ chức có nhiều subscriptions theo thời gian.",
      "Governed by plans: xác định giới hạn và giá.",
      "Generates invoices: mỗi chu kỳ billing tạo một invoice.",
    ],
    fields: [
      { name: "_id",            type: "ObjectId", desc: "Khóa chính duy nhất" },
      { name: "organizationId", type: "ObjectId", desc: "Tổ chức đăng ký (organizations)" },
      { name: "planId",         type: "ObjectId", desc: "Gói dịch vụ đang dùng (plans)" },
      { name: "status",         type: "String",   desc: "'trial' | 'active' | 'past_due' | 'cancelled'" },
      { name: "currentPeriodStart", type: "Date", desc: "Ngày bắt đầu chu kỳ thanh toán hiện tại" },
      { name: "currentPeriodEnd",   type: "Date", desc: "Ngày kết thúc chu kỳ thanh toán" },
      { name: "cancelAtPeriodEnd",  type: "Boolean", desc: "Hủy khi hết chu kỳ thay vì gia hạn" },
      { name: "createdAt",      type: "Date",     desc: "Thời điểm tạo subscription" },
      { name: "updatedAt",      type: "Date",     desc: "Thời điểm cập nhật gần nhất" },
    ],
    x: 390, y: 340,
  },
  {
    id: "invoices",
    label: "invoices",
    category: "BILLING ENGINE",
    tag: "Record",
    purpose: "Hóa đơn tài chính được tạo tự động mỗi chu kỳ billing từ subscriptions. Lưu tổng số tiền phải trả, trạng thái thanh toán và hạn nộp tiền. Khi khách hàng thanh toán, một bản ghi transactions được tạo.",
    keyConnections: [
      "Generated by subscriptions: mỗi chu kỳ billing sinh một invoice.",
      "Paid via transactions: lịch sử các lần thanh toán của invoice này.",
    ],
    fields: [
      { name: "_id",            type: "ObjectId", desc: "Khóa chính duy nhất của hóa đơn" },
      { name: "subscriptionId", type: "ObjectId", desc: "Subscription tạo ra hóa đơn này (subscriptions)" },
      { name: "amount",         type: "Number",   desc: "Tổng số tiền hóa đơn (USD)" },
      { name: "status",         type: "String",   desc: "'draft' | 'open' | 'paid' | 'void' | 'uncollectible'" },
      { name: "dueDate",        type: "Date",     desc: "Hạn thanh toán của hóa đơn" },
      { name: "paidAt",         type: "Date",     desc: "Thời điểm thanh toán thành công (nullable)" },
      { name: "lineItems",      type: "Array",    desc: "Chi tiết các mục tính phí trong hóa đơn" },
      { name: "createdAt",      type: "Date",     desc: "Thời điểm tạo hóa đơn" },
    ],
    x: 720, y: 340,
  },
  {
    id: "payment_methods",
    label: "payment_methods",
    category: "PAYMENT ENGINE",
    tag: "Wallet",
    purpose: "Lưu trữ thông tin phương thức thanh toán đã được tổ chức đăng ký và xác thực (thẻ tín dụng, ví điện tử, chuyển khoản). Thông tin nhạy cảm được tokenize qua Stripe/PayOS. Được dùng khi xử lý giao dịch.",
    keyConnections: [
      "Used by transactions: phương thức thanh toán được chọn khi thực hiện giao dịch.",
      "Belongs to organizations: mỗi tổ chức lưu nhiều phương thức thanh toán.",
    ],
    fields: [
      { name: "_id",            type: "ObjectId", desc: "Khóa chính duy nhất" },
      { name: "organizationId", type: "ObjectId", desc: "Tổ chức sở hữu phương thức (organizations)" },
      { name: "type",           type: "String",   desc: "'card' | 'bank_transfer' | 'e_wallet'" },
      { name: "token",          type: "String",   desc: "Token bảo mật từ Stripe/PayOS (không lưu raw)" },
      { name: "last4",          type: "String",   desc: "4 chữ số cuối thẻ (để hiển thị)" },
      { name: "isDefault",      type: "Boolean",  desc: "Phương thức mặc định cho auto-charge" },
      { name: "expiresAt",      type: "Date",     desc: "Ngày hết hạn thẻ/token (nullable)" },
      { name: "createdAt",      type: "Date",     desc: "Thời điểm liên kết phương thức thanh toán" },
    ],
    x: 840, y: 130,
  },
  {
    id: "transactions",
    label: "transactions",
    category: "PAYMENT ENGINE",
    tag: "Payment",
    purpose: "Ghi nhận từng giao dịch thanh toán thực tế phát sinh từ một invoice. Mỗi giao dịch trỏ tới phương thức thanh toán đã dùng và lưu trạng thái xử lý (pending, succeeded, failed). Là nguồn sự kiện kích hoạt webhook_logs.",
    keyConnections: [
      "Pays invoice: một transaction thanh toán cho một invoice.",
      "Uses payment_methods: phương thức thanh toán được sử dụng.",
      "Notified by webhook_logs: sự kiện giao dịch được ghi nhận ra bên ngoài.",
    ],
    fields: [
      { name: "_id",              type: "ObjectId", desc: "Khóa chính duy nhất của giao dịch" },
      { name: "invoiceId",        type: "ObjectId", desc: "Hóa đơn được thanh toán (invoices)" },
      { name: "paymentMethodId",  type: "ObjectId", desc: "Phương thức thanh toán đã dùng (payment_methods)" },
      { name: "amount",           type: "Number",   desc: "Số tiền giao dịch (USD)" },
      { name: "currency",         type: "String",   desc: "Đơn vị tiền tệ (ví dụ: 'USD', 'VND')" },
      { name: "status",           type: "String",   desc: "'pending' | 'succeeded' | 'failed' | 'refunded'" },
      { name: "gatewayRef",       type: "String",   desc: "Mã tham chiếu từ cổng thanh toán bên thứ ba" },
      { name: "failureReason",    type: "String",   desc: "Lý do thất bại nếu status = 'failed' (nullable)" },
      { name: "createdAt",        type: "Date",     desc: "Thời điểm tạo giao dịch" },
    ],
    x: 720, y: 580,
  },
  {
    id: "webhook_logs",
    label: "webhook_logs",
    category: "AUDIT & SYNC",
    tag: "Events",
    purpose: "Nhật ký tất cả sự kiện webhook gửi đến và gửi đi liên quan đến hệ thống thanh toán. Ghi lại payload, trạng thái phân phối, số lần thử lại và phản hồi từ endpoint đích. Phục vụ debugging và audit trail.",
    keyConnections: [
      "Notified by transactions: mỗi thay đổi trạng thái giao dịch tạo webhook event.",
    ],
    fields: [
      { name: "_id",         type: "ObjectId", desc: "Khóa chính duy nhất của bản ghi webhook" },
      { name: "transactionId", type: "ObjectId", desc: "Giao dịch kích hoạt webhook này (transactions, nullable)" },
      { name: "event",       type: "String",   desc: "Tên sự kiện: 'payment.succeeded', 'payment.failed', ..." },
      { name: "payload",     type: "Object",   desc: "Dữ liệu JSON đầy đủ của sự kiện" },
      { name: "endpoint",    type: "String",   desc: "URL endpoint nhận webhook" },
      { name: "status",      type: "String",   desc: "'pending' | 'delivered' | 'failed'" },
      { name: "attempts",    type: "Number",   desc: "Số lần đã thử gửi (tối đa 5 lần)" },
      { name: "responseCode", type: "Number",  desc: "HTTP status code nhận được từ endpoint" },
      { name: "createdAt",   type: "Date",     desc: "Thời điểm sự kiện được kích hoạt" },
    ],
    x: 1060, y: 130,
  },
];

export const PAYMENT_RELATIONS: PaymentRelation[] = [
  { from: "organizations",   to: "subscriptions",   label: "SUBSCRIBES",  fromCard: "1",   toCard: "0..1" },
  { from: "plans",           to: "subscriptions",   label: "GOVERNS",     fromCard: "1",   toCard: "N"    },
  { from: "subscriptions",   to: "invoices",        label: "GENERATES",   fromCard: "1",   toCard: "N"    },
  { from: "invoices",        to: "transactions",    label: "PAID VIA",    fromCard: "1",   toCard: "N"    },
  { from: "payment_methods", to: "transactions",    label: "USED BY",     fromCard: "1",   toCard: "N"    },
  { from: "transactions",    to: "webhook_logs",    label: "NOTIFIED BY", fromCard: "1",   toCard: "N"    },
];
