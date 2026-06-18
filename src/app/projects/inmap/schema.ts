// InMap Database Schema — data cho ER Visualizer
// Nguồn: docs/technical_documents/04-database-report.md (16 collection MongoDB)

export type CategoryKey =
  | "AUTHENTICATION"
  | "CORE SPATIAL"
  | "ROUTING GRAPH"
  | "POI & TENANT"
  | "FLOOR PLAN FEATURE"
  | "SOFTWARE ANALYTICS";

export interface Field {
  name: string;
  type: string;
  desc: string;
}

export interface Collection {
  id: string;
  label: string;
  category: CategoryKey;
  tag: string;
  purpose: string;
  keyConnections: string[];
  fields: Field[];
  x: number;
  y: number;
}

export interface Relation {
  from: string;
  to: string;
  label: string;
  fromCard: string; // cardinality cạnh from
  toCard: string;   // cardinality cạnh to
}

// Màu theo category — class Tailwind cố định (không dùng dynamic class)
export const CATEGORY_STYLE: Record<CategoryKey, {
  border: string; bar: string; text: string; chipBg: string; stroke: string;
}> = {
  "AUTHENTICATION":     { border: "border-violet-500/60",  bar: "bg-violet-500",  text: "text-violet-300",  chipBg: "bg-violet-500/10",  stroke: "#8b5cf6" },
  "CORE SPATIAL":       { border: "border-cyan-500/60",    bar: "bg-cyan-400",    text: "text-cyan-300",    chipBg: "bg-cyan-500/10",    stroke: "#22d3ee" },
  "ROUTING GRAPH":      { border: "border-emerald-500/60", bar: "bg-emerald-400", text: "text-emerald-300", chipBg: "bg-emerald-500/10", stroke: "#34d399" },
  "POI & TENANT":       { border: "border-amber-500/60",   bar: "bg-amber-400",   text: "text-amber-300",   chipBg: "bg-amber-500/10",   stroke: "#fbbf24" },
  "FLOOR PLAN FEATURE": { border: "border-pink-500/60",    bar: "bg-pink-400",    text: "text-pink-300",    chipBg: "bg-pink-500/10",    stroke: "#f472b6" },
  "SOFTWARE ANALYTICS": { border: "border-blue-500/60",    bar: "bg-blue-400",    text: "text-blue-300",    chipBg: "bg-blue-500/10",    stroke: "#60a5fa" },
};

export const COLLECTIONS: Collection[] = [
  {
    id: "users",
    label: "users",
    category: "AUTHENTICATION",
    tag: "RBAC",
    purpose: "Lưu trữ thông tin người dùng được đồng bộ từ hệ thống quản lý danh tính Keycloak, phục vụ hiển thị hồ sơ và phân quyền toàn cục. Tài khoản có globalRole là SYSTEM_ADMIN sẽ tự động bypass qua bảng user_building_roles để có toàn quyền hệ thống.",
    keyConnections: ["Parent of user_building_roles: có các quyền chi tiết đối với từng tòa nhà (chỉ áp dụng cho PORTAL_USER)."],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của người dùng" },
      { name: "keycloakUserId", type: "String", desc: "ID tài khoản Keycloak của người dùng (sub claim)" },
      { name: "email", type: "String", desc: "Địa chỉ email (duy nhất)" },
      { name: "name", type: "String", desc: "Họ và tên hiển thị" },
      { name: "globalRole", type: "String", desc: "Vai trò hệ thống toàn cục: 'SYSTEM_ADMIN' (bypass phân quyền tòa nhà) hoặc 'PORTAL_USER'" },
      { name: "createdAt", type: "Date", desc: "Thời điểm tạo bản ghi" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật bản ghi" },
    ],
    x: 60, y: 60,
  },
  {
    id: "user_building_roles",
    label: "user_building_roles",
    category: "AUTHENTICATION",
    tag: "Junction",
    purpose: "Bảng trung gian (Junction Collection) ánh xạ quyền quản lý/sở hữu của người dùng đối với từng tòa nhà cụ thể. Tách biệt hoàn toàn phần xác thực (Keycloak) và phần quyền tài nguyên nội bộ. Không cần tạo bản ghi cho SYSTEM_ADMIN vì họ được bypass tự động.",
    keyConnections: [
      "Linked to users qua Keycloak User ID.",
      "Linked to buildings để xác định tòa nhà được phân quyền.",
    ],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của bản ghi phân quyền" },
      { name: "keycloakUserId", type: "String", desc: "ID tài khoản Keycloak của người dùng (sub claim)" },
      { name: "buildingId", type: "ObjectId", desc: "ID tòa nhà được chỉ định quyền (buildings)" },
      { name: "role", type: "String", desc: "Vai trò cụ thể đối với tòa nhà này: 'MANAGER' hoặc 'OWNER'" },
      { name: "createdAt", type: "Date", desc: "Thời điểm phân quyền" },
    ],
    x: 330, y: 190,
  },
  {
    id: "organizations",
    label: "organizations",
    category: "AUTHENTICATION",
    tag: "Tenant",
    purpose: "Quản lý doanh nghiệp hoặc chuỗi sở hữu bất động sản (Multi-Tenant). Phân vùng tài nguyên độc lập ở cấp độ công ty phần mềm.",
    keyConnections: ["Parent of buildings: một tổ chức sở hữu và triển khai nhiều tòa nhà/chi nhánh."],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của doanh nghiệp" },
      { name: "name", type: "String", desc: "Tên doanh nghiệp / tổ chức sở hữu" },
      { name: "plan", type: "String", desc: "Gói đăng ký dịch vụ phần mềm: 'FREE', 'BASIC', hoặc 'ENTERPRISE'" },
      { name: "createdAt", type: "Date", desc: "Thời điểm đăng ký tổ chức" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật gần nhất" },
    ],
    x: 60, y: 470,
  },
  {
    id: "buildings",
    label: "buildings",
    category: "CORE SPATIAL",
    tag: "Parent",
    purpose: "Thực thể cha cao nhất của mỗi cơ sở vật chất, lưu giữ thông tin tên tòa nhà, địa chỉ và tổng số tầng hiện hành.",
    keyConnections: ["Parent of floors: một tòa nhà chứa nhiều tầng."],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của tòa nhà" },
      { name: "organizationId", type: "ObjectId", desc: "Liên kết tới doanh nghiệp sở hữu (organizations)" },
      { name: "name", type: "String", desc: "Tên tòa nhà (ví dụ: 'AEON Mall Long Biên')" },
      { name: "addressLabel", type: "String", desc: "Địa chỉ thực tế của tòa nhà" },
      { name: "totalFloors", type: "Number", desc: "Tổng số tầng hiện có trong tòa nhà" },
      { name: "createdAt", type: "Date", desc: "Thời điểm tạo bản ghi" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật bản ghi" },
    ],
    x: 470, y: 300,
  },
  {
    id: "floors",
    label: "floors",
    category: "CORE SPATIAL",
    tag: "Level",
    purpose: "Quản lý dữ liệu sơ đồ ảnh của từng tầng mặt bằng, kích thước không gian ảo và tỷ lệ chuyển đổi pixel ảnh sang mét thực tế.",
    keyConnections: [
      "Linked to buildings.",
      "Parent of spaces, nodes, located_features và connectors.",
    ],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của tầng" },
      { name: "buildingId", type: "ObjectId", desc: "Liên kết tới tòa nhà sở hữu (buildings)" },
      { name: "floorNumber", type: "Number", desc: "Vị trí tầng (0: Tầng trệt, 1: Lầu 1, -1: Tầng hầm)" },
      { name: "floorPlanImageUrl", type: "String", desc: "Đường dẫn URL của sơ đồ mặt bằng PNG" },
      { name: "dimensions", type: "Object", desc: "Kích thước lưới ảo trên màn hình { width, height }" },
      { name: "scale", type: "Number", desc: "Tỷ lệ chuyển đổi pixel ảnh sang mét thực tế (ví dụ: 0.15)" },
      { name: "createdAt", type: "Date", desc: "Thời điểm tải sơ đồ mặt bằng" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm sửa đổi gần nhất" },
    ],
    x: 350, y: 480,
  },
  {
    id: "spaces",
    label: "spaces",
    category: "CORE SPATIAL",
    tag: "Zone",
    purpose: "Lưu trữ ranh giới hình học đa giác (2D Polygon) và chiều cao tường của các phòng, hành lang, sảnh để phục vụ dựng hình tường 3D và tìm đường.",
    keyConnections: [
      "Linked to floors. Trỏ cửa/lối vào tới nodes (doorNodeId).",
      "Parent of pois, located_features và space_boundaries.",
    ],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của không gian" },
      { name: "floorId", type: "ObjectId", desc: "Liên kết tới tầng chứa không gian (floors)" },
      { name: "spaceCode", type: "String", desc: "Mã định danh không gian (ví dụ: 'RM-101', 'HW-02')" },
      { name: "spaceLabel", type: "String", desc: "Nhãn hiển thị không gian (ví dụ: 'Phòng họp A', 'Hành lang sảnh Tây')" },
      { name: "type", type: "String", desc: "Loại không gian: 'ROOM', 'CORRIDOR', 'HALLWAY', 'LOBBY', 'UTILITY', 'OTHER'" },
      { name: "height", type: "Number", desc: "Chiều cao tường 3D để đùn khối (mét, ví dụ: 3.2)" },
      { name: "geometry", type: "Object", desc: "Tọa độ đa giác phẳng: { type: 'POLYGON', points: [{ x, y }], center: { x, y } }" },
      { name: "doorNodeId", type: "ObjectId", desc: "Nút đồ thị kết nối ngay trước cửa/lối vào (nodes, nullable)" },
      { name: "createdAt", type: "Date", desc: "Thời điểm tạo" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật" },
    ],
    x: 770, y: 500,
  },
  {
    id: "space_boundaries",
    label: "space_boundaries",
    category: "CORE SPATIAL",
    tag: "Wall Edge",
    purpose: "Mô tả chi tiết từng cạnh ranh giới (bức tường, cửa, ô thoáng) của đa giác không gian, đóng vai trò quyết định trong việc dựng tường 3D vật lý.",
    keyConnections: ["Linked to spaces (không gian sở hữu và không gian kề cận bên kia tường nếu có)."],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của cạnh ranh giới" },
      { name: "spaceId", type: "ObjectId", desc: "Không gian sở hữu cạnh ranh giới này (spaces)" },
      { name: "seqNo", type: "Number", desc: "Thứ tự của cạnh ranh giới trong đa giác không gian (0-indexed)" },
      { name: "startPoint", type: "Object", desc: "Tọa độ điểm bắt đầu cạnh: { x, y }" },
      { name: "endPoint", type: "Object", desc: "Tọa độ điểm kết thúc cạnh: { x, y }" },
      { name: "boundaryType", type: "String", desc: "Loại ranh giới: 'wall', 'opening', 'door', 'shared', 'unknown'" },
      { name: "adjacentSpaceId", type: "ObjectId", desc: "Không gian kề cận bên kia tường nếu có (spaces, nullable)" },
      { name: "hasWall", type: "Boolean", desc: "true = cần render tường vật lý 3D đè lên cạnh ranh giới này" },
      { name: "createdAt", type: "Date", desc: "Thời điểm tạo" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật" },
    ],
    x: 1130, y: 510,
  },
  {
    id: "categories",
    label: "categories",
    category: "POI & TENANT",
    tag: "Classification",
    purpose: "Bảng danh mục phân loại các điểm đến (POI). Cho phép người dùng lọc và tìm kiếm theo nhóm ngành ('Đồ ăn nhanh', 'Thời trang', 'Dịch vụ'...).",
    keyConnections: ["Parent of pois (1:N)."],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của danh mục" },
      { name: "name", type: "String", desc: "Tên danh mục hiển thị (ví dụ: 'Fast Food', 'Fashion')" },
      { name: "nameLocalized", type: "Object", desc: "Tên dịch đa ngôn ngữ: { vi: 'Đồ ăn nhanh', en: 'Fast Food' }" },
      { name: "icon", type: "String", desc: "Tên icon hoặc emoji đại diện (ví dụ: '🍔', 'utensils')" },
      { name: "sortOrder", type: "Number", desc: "Thứ tự hiển thị trong danh sách lọc" },
      { name: "createdAt", type: "Date", desc: "Thời điểm tạo danh mục" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật danh mục" },
    ],
    x: 1180, y: 250,
  },
  {
    id: "pois",
    label: "pois",
    category: "POI & TENANT",
    tag: "POI",
    purpose: "Đại diện cho thương hiệu / dịch vụ / tiện ích đang chiếm giữ một không gian tại thời điểm hiện tại. Lớp dữ liệu thay đổi khi người thuê thay đổi, trong khi dữ liệu không gian vật lý (spaces) giữ nguyên.",
    keyConnections: [
      "Linked to spaces (đang chiếm giữ).",
      "Linked to categories (phân loại kinh doanh).",
    ],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của điểm đến" },
      { name: "spaceId", type: "ObjectId", desc: "Liên kết tới không gian vật lý đang chiếm giữ (spaces)" },
      { name: "categoryId", type: "ObjectId", desc: "Liên kết tới danh mục phân loại (categories)" },
      { name: "name", type: "String", desc: "Tên thương hiệu / dịch vụ (ví dụ: 'KFC', 'Highlands Coffee')" },
      { name: "nameLocalized", type: "Object", desc: "Tên dịch đa ngôn ngữ: { vi: '...', en: '...' }" },
      { name: "description", type: "String", desc: "Mô tả chi tiết (giờ hoạt động, liên hệ, khuyến mãi)" },
      { name: "keywords", type: "Array<String>", desc: "Từ khóa tìm kiếm (ví dụ: ['gà rán', 'chicken', 'fastfood'])" },
      { name: "logoUrl", type: "String", desc: "Đường dẫn URL logo thương hiệu" },
      { name: "contactInfo", type: "Object", desc: "Thông tin liên hệ: { phone, email, website }" },
      { name: "openingHours", type: "Object", desc: "Giờ mở cửa: { mon: '09:00-22:00', ... }" },
      { name: "active", type: "Boolean", desc: "true = đang hoạt động tại phòng này, false = đã rời đi (lưu lịch sử)" },
      { name: "createdAt", type: "Date", desc: "Thời điểm gắn POI vào phòng" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật thông tin POI" },
    ],
    x: 1120, y: 360,
  },
  {
    id: "nodes",
    label: "nodes",
    category: "ROUTING GRAPH",
    tag: "Vertex",
    purpose: "Lưu giữ các đỉnh (Vertices) của mạng lưới định tuyến. Có tọa độ 3D cụ thể và loại hành lang, ngã rẽ hay cửa ra vào.",
    keyConnections: [
      "Linked to floors. Linked to edges (điểm đầu/cuối). Grouped by connectors.",
      "Linked to located_features (đối tượng đại diện tương ứng nếu có) và scheduled_blockages.",
    ],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của nút đồ thị" },
      { name: "floorId", type: "ObjectId", desc: "Liên kết tới tầng chứa nút (floors)" },
      { name: "locatedFeatureId", type: "ObjectId", desc: "Liên kết tới đối tượng vật lý/thiết bị tương ứng (nullable, located_features)" },
      { name: "type", type: "String", desc: "Thể loại nút: 'CORRIDOR', 'DOOR', 'JUNCTION', 'ELEVATOR', 'STAIR'" },
      { name: "coords", type: "Object", desc: "Hệ tọa độ 3D mét: { x, y, z } (z tính tự động theo cao độ tầng)" },
      { name: "active", type: "Boolean", desc: "Trạng thái hoạt động (đặt false để ngưng định tuyến đi qua khi bảo trì)" },
      { name: "metadata", type: "Object", desc: "Nhãn bổ sung tùy chọn (ví dụ: { label: 'Sảnh Chờ A' })" },
      { name: "createdAt", type: "Date", desc: "Thời điểm tạo nút" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật nút" },
    ],
    x: 560, y: 690,
  },
  {
    id: "edges",
    label: "edges",
    category: "ROUTING GRAPH",
    tag: "Weight",
    purpose: "Lưu giữ các cạnh (Edges) kết nối trực tiếp giữa các nút kề nhau. Lưu sẵn khoảng cách Euclid để thuật toán A* truy vấn cực nhanh.",
    keyConnections: [
      "Linked to nodes (N-N xuất phát - kết thúc).",
      "Linked to scheduled_blockages (lịch bảo trì chặn đường).",
    ],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của cạnh nối" },
      { name: "fromNodeId", type: "ObjectId", desc: "Liên kết tới nút xuất phát (nodes)" },
      { name: "toNodeId", type: "ObjectId", desc: "Liên kết tới nút kết thúc (nodes)" },
      { name: "distance", type: "Number", desc: "Khoảng cách mét Euclid đã tính toán trước (tiết kiệm CPU)" },
      { name: "accessible", type: "Boolean", desc: "Đường đi có hỗ trợ xe lăn / người tàn tật hay không" },
      { name: "active", type: "Boolean", desc: "Trạng thái đóng/mở đường đi tĩnh để bảo trì" },
      { name: "isEscalator", type: "Boolean", desc: "Định vị là thang cuốn (hỗ trợ bộ lọc lộ trình)" },
      { name: "isElevator", type: "Boolean", desc: "Định vị là thang máy (hỗ trợ bộ lọc lộ trình)" },
      { name: "isStairs", type: "Boolean", desc: "Định vị là thang bộ (hỗ trợ bộ lọc lộ trình)" },
      { name: "createdAt", type: "Date", desc: "Thời điểm tạo cạnh" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật cạnh" },
    ],
    x: 540, y: 900,
  },
  {
    id: "connectors",
    label: "connectors",
    category: "ROUTING GRAPH",
    tag: "Vertical",
    purpose: "Quản lý hệ thống giao thông đứng (thang máy, thang cuốn, thang bộ), chứa danh sách các nút dừng tương ứng ở từng tầng.",
    keyConnections: ["Linked to floors và groups các nodes để thực hiện chuyển tầng."],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của trục thẳng đứng" },
      { name: "buildingId", type: "ObjectId", desc: "Liên kết tới tòa nhà (buildings)" },
      { name: "type", type: "String", desc: "Loại cầu nối đứng: 'ELEVATOR', 'STAIR', hoặc 'ESCALATOR'" },
      { name: "name", type: "String", desc: "Tên trục thẳng đứng (ví dụ: 'Trục Thang Máy Trung Tâm A')" },
      { name: "active", type: "Boolean", desc: "Trạng thái hoạt động toàn bộ trục thang" },
      { name: "servedFloors", type: "Array<Object>", desc: "Các tầng trục phục vụ và sảnh chờ tương ứng: [{ floorId, nodeId }]" },
      { name: "createdAt", type: "Date", desc: "Thời điểm khởi tạo trục đứng" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật gần nhất" },
    ],
    x: 920, y: 690,
  },
  {
    id: "scheduled_blockages",
    label: "scheduled_blockages",
    category: "ROUTING GRAPH",
    tag: "Schedule",
    purpose: "Bộ lưu trữ lịch bảo trì và chặn đường tạm thời. Tự động hóa việc đóng cửa các cạnh hoặc nút đường đi theo lịch trình thời gian cụ thể bằng phần mềm.",
    keyConnections: [
      "Linked to nodes (nodeId, nullable).",
      "Linked to edges (edgeId, nullable) để gán lịch chặn tạm thời.",
    ],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của sự kiện chặn đường" },
      { name: "name", type: "String", desc: "Tên sự kiện bảo trì (ví dụ: 'Bảo trì Thang máy A')" },
      { name: "nodeId", type: "ObjectId", desc: "ID của điểm nút định tuyến bị chặn (nullable, nodes)" },
      { name: "edgeId", type: "ObjectId", desc: "ID của cạnh định tuyến bị chặn (nullable, edges)" },
      { name: "start", type: "Date", desc: "Thời gian bắt đầu có hiệu lực chặn" },
      { name: "end", type: "Date", desc: "Thời gian kết thúc có hiệu lực chặn" },
      { name: "recurring", type: "Object", desc: "Lịch lặp lại: { type: 'ONCE'|'DAILY'|'WEEKLY', daysOfWeek: [], startTime, endTime }" },
      { name: "reason", type: "String", desc: "Lý do chặn đường (vệ sinh, hỏng hóc...)" },
      { name: "status", type: "String", desc: "Trạng thái lịch chặn: 'active', 'inactive', 'scheduled'" },
      { name: "createdAt", type: "Date", desc: "Thời điểm đăng lịch bảo trì" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật lịch bảo trì" },
    ],
    x: 180, y: 780,
  },
  {
    id: "located_features",
    label: "located_features",
    category: "FLOOR PLAN FEATURE",
    tag: "Instance",
    purpose: "Lưu trữ thực thể vật thể/thiết bị cụ thể đã được bố trí trên mặt bằng (máy bán nước số hiệu A, camera giám sát số hiệu B, ghế sofa cụ thể). Mỗi đối tượng tham chiếu đến thiết kế mẫu trong thư viện và có tọa độ, thuộc tính riêng biệt.",
    keyConnections: [
      "Linked to floors, spaces (nếu có), feature_libraries (lấy cấu hình mẫu/BIM catalog).",
      "Được trỏ tới từ nodes.",
    ],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của đối tượng được bố trí" },
      { name: "floorId", type: "ObjectId", desc: "Liên kết tới tầng chứa đối tượng (floors)" },
      { name: "spaceId", type: "ObjectId", desc: "Liên kết tới không gian chứa đối tượng nếu có (nullable, spaces)" },
      { name: "libraryId", type: "ObjectId", desc: "Liên kết tới mẫu thiết kế từ thư viện mẫu (feature_libraries)" },
      { name: "geometry", type: "Object", desc: "Hệ tọa độ 2D/3D vị trí đặt đối tượng: { x, y, rotation, scale }" },
      { name: "customProperties", type: "Object", desc: "Thuộc tính tùy biến ghi đè cho thiết bị cụ thể (serial, ngày bảo trì, trạng thái hoạt động)" },
      { name: "createdAt", type: "Date", desc: "Thời điểm tạo bản ghi bố trí" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật bản ghi bố trí" },
    ],
    x: 870, y: 300,
  },
  {
    id: "feature_libraries",
    label: "feature_libraries",
    category: "FLOOR PLAN FEATURE",
    tag: "Library",
    purpose: "Thư viện mẫu dùng chung quản lý danh mục thiết bị, mô hình 3D và tài sản (CAD/BIM catalog) có thể tái sử dụng. Chứa mô hình 3D GLTF, icon hiển thị và thông số mặc định của loại tài sản.",
    keyConnections: ["Parent of located_features: được các vật thể bố trí trên mặt sàn tham chiếu."],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của mẫu thư viện" },
      { name: "name", type: "String", desc: "Tên loại đối tượng mẫu (ví dụ: 'Camera dome AXIS P3245', 'Ghế sofa đơn')" },
      { name: "category", type: "String", desc: "Phân nhóm loại thiết bị (ví dụ: 'security', 'furniture', 'iot', 'signage')" },
      { name: "modelUrl", type: "String", desc: "Đường dẫn tải file mô hình 3D định dạng GLTF/GLB" },
      { name: "icon", type: "String", desc: "Icon hiển thị trên bản vẽ 2D (tên Lucide icon hoặc CSS class)" },
      { name: "defaultProperties", type: "Object", desc: "Các thuộc tính cấu hình mặc định (nhà sản xuất, công suất, độ phân giải)" },
      { name: "createdAt", type: "Date", desc: "Thời điểm tạo mẫu thư viện" },
      { name: "updatedAt", type: "Date", desc: "Thời điểm cập nhật mẫu thư viện" },
    ],
    x: 1050, y: 150,
  },
  {
    id: "search_logs",
    label: "search_logs",
    category: "SOFTWARE ANALYTICS",
    tag: "Log",
    purpose: "Nhật ký lưu trữ cụm từ tìm kiếm và lộ trình của khách hàng nhằm thực hiện báo cáo kinh doanh và thống kê vị trí phổ biến (heatmap).",
    keyConnections: ["Linked to buildings để lọc báo cáo theo tòa nhà."],
    fields: [
      { name: "_id", type: "ObjectId", desc: "Khóa chính duy nhất của nhật ký tìm kiếm" },
      { name: "buildingId", type: "ObjectId", desc: "Liên kết tới tòa nhà diễn ra tìm kiếm (buildings)" },
      { name: "startNodeId", type: "ObjectId", desc: "Điểm xuất phát được định tuyến (nodes)" },
      { name: "endNodeId", type: "ObjectId", desc: "Điểm đích tìm kiếm của người dùng (nodes)" },
      { name: "queryText", type: "String", desc: "Từ khóa tìm kiếm thô người dùng đã gõ" },
      { name: "timestamp", type: "Date", desc: "Thời gian thực hiện tìm kiếm" },
    ],
    x: 720, y: 60,
  },
];

export const RELATIONS: Relation[] = [
  { from: "users",               to: "user_building_roles", label: "HAS ROLES",         fromCard: "1", toCard: "N" },
  { from: "user_building_roles", to: "buildings",           label: "ASSIGNED TO",       fromCard: "N", toCard: "1" },
  { from: "organizations",       to: "buildings",           label: "OWNS",              fromCard: "1", toCard: "N" },
  { from: "buildings",           to: "floors",              label: "HAS LEVELS",        fromCard: "1", toCard: "N" },
  { from: "buildings",           to: "search_logs",         label: "LOGS ACTIVITY",     fromCard: "1", toCard: "N" },
  { from: "floors",              to: "spaces",              label: "CONTAINS",          fromCard: "1", toCard: "N" },
  { from: "floors",              to: "nodes",               label: "HAS PATH NODES",    fromCard: "1", toCard: "N" },
  { from: "floors",              to: "located_features",    label: "DEFINES FEATURES",  fromCard: "1", toCard: "N" },
  { from: "floors",              to: "connectors",          label: "HAS VERTICAL SHAFTS",fromCard:"1", toCard: "N" },
  { from: "spaces",              to: "space_boundaries",    label: "REPRESENTS ASSET",  fromCard: "1", toCard: "N" },
  { from: "spaces",              to: "pois",                label: "OCCUPIED BY",       fromCard: "1", toCard: "0..1" },
  { from: "spaces",              to: "located_features",    label: "CONTAINS FEATURE",  fromCard: "1", toCard: "0..N" },
  { from: "categories",          to: "pois",                label: "CLASSIFIED AS",     fromCard: "1", toCard: "N" },
  { from: "nodes",               to: "edges",               label: "CONNECTS",          fromCard: "2", toCard: "N" },
  { from: "feature_libraries",   to: "located_features",    label: "INSTANTIATES",      fromCard: "1", toCard: "0..1" },
  { from: "nodes",               to: "scheduled_blockages", label: "BLOCKS NODE",       fromCard: "1", toCard: "N" },
  { from: "edges",               to: "scheduled_blockages", label: "BLOCKS EDGE",       fromCard: "1", toCard: "N" },
  { from: "connectors",          to: "nodes",               label: "BRIDGES FLOORS",    fromCard: "1", toCard: "N" },
];
