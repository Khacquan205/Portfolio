# 3. Database Report

Tài liệu này đặc tả chi tiết cấu trúc cơ sở dữ liệu của hệ thống định vị & chỉ đường InMap. Hệ thống sử dụng cơ sở dữ liệu MongoDB để quản lý và vận hành thông tin đa tầng, phân quyền doanh nghiệp và điều hướng đồ thị. Dưới đây là mô tả chi tiết cho 16 collection chính của hệ thống.

---

### 1. users
**Mô tả:** Lưu trữ thông tin người dùng được đồng bộ từ hệ thống quản lý danh tính Keycloak, phục vụ hiển thị hồ sơ và phân quyền toàn cục. (Lưu ý: Tài khoản có globalRole là SYSTEM_ADMIN sẽ tự động bypass qua bảng user_building_roles để có toàn quyền hệ thống)
* **Phân vùng:** RBAC Boundary
* **Quan hệ chính:** Parent of `user_building_roles` (Có các quyền chi tiết đối với từng tòa nhà - chỉ áp dụng cho PORTAL_USER)

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của người dùng |
| `keycloakUserId` | String | ID tài khoản Keycloak của người dùng (sub claim) |
| `email` | String | Địa chỉ email (duy nhất) |
| `name` | String | Họ và tên hiển thị |
| `globalRole` | String | Vai trò hệ thống toàn cục: 'SYSTEM_ADMIN' (bypass phân quyền tòa nhà) hoặc 'PORTAL_USER' |
| `createdAt` | Date | Thời điểm tạo bản ghi |
| `updatedAt` | Date | Thời điểm cập nhật bản ghi |

---

### 2. user_building_roles
**Mô tả:** Bảng trung gian (Junction Collection) ánh xạ quyền quản lý/sở hữu của người dùng đối với từng tòa nhà cụ thể. Tách biệt hoàn toàn phần xác thực (Keycloak) và phần quyền tài nguyên nội bộ. (Lưu ý: Không cần tạo bản ghi trong collection này cho SYSTEM_ADMIN vì họ được bypass tự động)
* **Phân vùng:** Junction RBAC
* **Quan hệ chính:** Linked to `users` qua Keycloak User ID, Linked to `buildings` để xác định tòa nhà được phân quyền.

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của bản ghi phân quyền |
| `keycloakUserId` | String | ID tài khoản Keycloak của người dùng (sub claim) |
| `buildingId` | ObjectId | ID tòa nhà được chỉ định quyền (buildings) |
| `role` | String | Vai trò cụ thể đối với tòa nhà này: 'MANAGER' hoặc 'OWNER' |
| `createdAt` | Date | Thời điểm phân quyền |

---

### 3. organizations
**Mô tả:** Quản lý doanh nghiệp hoặc chuỗi sở hữu bất động sản (Multi-Tenant). Phân vùng tài nguyên độc lập ở cấp độ công ty phần mềm.
* **Phân vùng:** Tenant Definition
* **Quan hệ chính:** Parent of `buildings` (Một tổ chức sở hữu và triển khai nhiều tòa nhà/chi nhánh)

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của doanh nghiệp |
| `name` | String | Tên doanh nghiệp / tổ chức sở hữu |
| `plan` | String | Gói đăng ký dịch vụ phần mềm: 'FREE', 'BASIC', hoặc 'ENTERPRISE' |
| `createdAt` | Date | Thời điểm đăng ký tổ chức |
| `updatedAt` | Date | Thời điểm cập nhật gần nhất |

---

### 4. scheduled_blockages
**Mô tả:** Bộ lưu trữ lịch bảo trì và chặn đường tạm thời. Tự động hóa việc đóng cửa các cạnh hoặc nút đường đi theo lịch trình thời gian cụ thể bằng phần mềm.
* **Phân vùng:** Software Schedule
* **Quan hệ chính:** Linked to `nodes` (nodeId, nullable) và `edges` (edgeId, nullable) để gán lịch chặn tạm thời.

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của sự kiện chặn đường |
| `name` | String | Tên sự kiện bảo trì (ví dụ: 'Bảo trì Thang máy A') |
| `nodeId` | ObjectId | ID của điểm nút định tuyến bị chặn (nullable, nodes) |
| `edgeId` | ObjectId | ID của cạnh định tuyến bị chặn (nullable, edges) |
| `start` | Date | Thời gian bắt đầu có hiệu lực chặn |
| `end` | Date | Thời gian kết thúc có hiệu lực chặn |
| `recurring` | Object | Lịch lặp lại: { type: 'ONCE'\|'DAILY'\|'WEEKLY', daysOfWeek: [], startTime, endTime } |
| `reason` | String | Lý do chặn đường (vệ sinh, hỏng hóc...) |
| `status` | String | Trạng thái lịch chặn: 'active' (đang chặn), 'inactive' (không hoạt động), 'scheduled' (lên lịch) |
| `createdAt` | Date | Thời điểm đăng lịch bảo trì |
| `updatedAt` | Date | Thời điểm cập nhật lịch bảo trì |

---

### 5. buildings
**Mô tả:** Thực thể cha cao nhất của mỗi cơ sở vật chất, lưu giữ thông tin tên tòa nhà, địa chỉ và tổng số tầng hiện hành.
* **Phân vùng:** 1-to-Many Floors
* **Quan hệ chính:** Parent of `floors` (Một tòa nhà chứa nhiều tầng)

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của tòa nhà |
| `organizationId` | ObjectId | Liên kết tới doanh nghiệp sở hữu (organizations) |
| `name` | String | Tên tòa nhà (ví dụ: 'AEON Mall Long Biên') |
| `addressLabel` | String | Địa chỉ thực tế của tòa nhà |
| `totalFloors` | Number | Tổng số tầng hiện có trong tòa nhà |
| `createdAt` | Date | Thời điểm tạo bản ghi |
| `updatedAt` | Date | Thời điểm cập nhật bản ghi |

---

### 6. floors
**Mô tả:** Quản lý dữ liệu sơ đồ ảnh của từng tầng mặt bằng, kích thước không gian ảo và tỷ lệ chuyển đổi pixel ảnh sang mét thực tế.
* **Phân vùng:** Scale Reference Layer
* **Quan hệ chính:** Linked to `buildings`. Parent of `spaces`, `nodes`, `located_features` và `connectors`.

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của tầng |
| `buildingId` | ObjectId | Liên kết tới tòa nhà sở hữu (buildings) |
| `floorNumber` | Number | Vị trí tầng (0: Tầng trệt, 1: Lầu 1, -1: Tầng hầm) |
| `floorPlanImageUrl` | String | Đường dẫn URL của sơ đồ mặt bằng PNG |
| `dimensions` | Object | Kích thước lưới ảo trên màn hình { width, height } |
| `scale` | Number | Tỷ lệ chuyển đổi pixel ảnh sang mét thực tế (ví dụ: 0.15) |
| `createdAt` | Date | Thời điểm tải sơ đồ mặt bằng |
| `updatedAt` | Date | Thời điểm sửa đổi gần nhất |

---

### 7. spaces
**Mô tả:** Lưu trữ ranh giới hình học đa giác (2D Polygon) và chiều cao tường của các phòng, hành lang, sảnh để phục vụ dựng hình tường 3D và tìm đường.
* **Phân vùng:** 2D Polygon Geometry
* **Quan hệ chính:** Linked to `floors`. Trỏ cửa/lối vào tới `nodes` (doorNodeId). Parent of `pois`, `located_features` và `space_boundaries`.

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của không gian |
| `floorId` | ObjectId | Liên kết tới tầng chứa không gian (floors) |
| `spaceCode` | String | Mã định danh không gian (ví dụ: 'RM-101', 'HW-02') |
| `spaceLabel` | String | Nhãn hiển thị không gian (ví dụ: 'Phòng họp A', 'Hành lang sảnh Tây') |
| `type` | String | Loại không gian: 'ROOM', 'CORRIDOR', 'HALLWAY', 'LOBBY', 'UTILITY', 'OTHER' |
| `height` | Number | Chiều cao tường 3D để đùn khối (mét, ví dụ: 3.2) |
| `geometry` | Object | Tọa độ đa giác phẳng: { type: 'POLYGON', points: [{ x, y }], center: { x, y } } |
| `doorNodeId` | ObjectId | Nút đồ thị kết nối ngay trước cửa/lối vào (nodes, nullable) |
| `createdAt` | Date | Thời điểm tạo |
| `updatedAt` | Date | Thời điểm cập nhật |

---

### 8. space_boundaries
**Mô tả:** Mô tả chi tiết từng cạnh ranh giới (bức tường, cửa, ô thoáng) của đa giác không gian, đóng vai trò quyết định trong việc dựng tường 3D vật lý.
* **Phân vùng:** 3D Wall Segment Details
* **Quan hệ chính:** Linked to `spaces` (không gian sở hữu và không gian kề cận bên kia tường nếu có).

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của cạnh ranh giới |
| `spaceId` | ObjectId | Không gian sở hữu cạnh ranh giới này (spaces) |
| `seqNo` | Number | Thứ tự của cạnh ranh giới trong đa giác không gian (0-indexed) |
| `startPoint` | Object | Tọa độ điểm bắt đầu cạnh: { x, y } |
| `endPoint` | Object | Tọa độ điểm kết thúc cạnh: { x, y } |
| `boundaryType` | String | Loại ranh giới: 'wall' (tường), 'opening' (lối đi mở), 'door' (cửa), 'shared' (chung), 'unknown' |
| `adjacentSpaceId` | ObjectId | Không gian kề cận bên kia tường nếu có (spaces, nullable) |
| `hasWall` | Boolean | true = cần render tường vật lý 3D đè lên cạnh ranh giới này |
| `createdAt` | Date | Thời điểm tạo |
| `updatedAt` | Date | Thời điểm cập nhật |

---

### 9. categories
**Mô tả:** Bảng danh mục phân loại các điểm đến (POI). Cho phép người dùng lọc và tìm kiếm theo nhóm ngành ('Đồ ăn nhanh', 'Thời trang', 'Dịch vụ'...).
* **Phân vùng:** Category Index
* **Quan hệ chính:** Parent of `pois` (1:N)

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của danh mục |
| `name` | String | Tên danh mục hiển thị (ví dụ: 'Fast Food', 'Fashion') |
| `nameLocalized` | Object | Tên dịch đa ngôn ngữ: { vi: 'Đồ ăn nhanh', en: 'Fast Food' } |
| `icon` | String | Tên icon hoặc emoji đại diện (ví dụ: '🍔', 'utensils') |
| `sortOrder` | Number | Thứ tự hiển thị trong danh sách lọc |
| `createdAt` | Date | Thời điểm tạo danh mục |
| `updatedAt` | Date | Thời điểm cập nhật danh mục |

---

### 10. pois
**Mô tả:** Đại diện cho thương hiệu / dịch vụ / tiện ích đang chiếm giữ một không gian tại thời điểm hiện tại. Đây là lớp dữ liệu thay đổi khi người thuê thay đổi, trong khi dữ liệu không gian vật lý (spaces) giữ nguyên.
* **Phân vùng:** Dynamic Tenant Layer
* **Quan hệ chính:** Linked to `spaces` (đang chiếm giữ) và `categories` (phân loại kinh doanh).

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của điểm đến |
| `spaceId` | ObjectId | Liên kết tới không gian vật lý đang chiếm giữ (spaces) |
| `categoryId` | ObjectId | Liên kết tới danh mục phân loại (categories) |
| `name` | String | Tên thương hiệu / dịch vụ (ví dụ: 'KFC', 'Highlands Coffee') |
| `nameLocalized` | Object | Tên dịch đa ngôn ngữ: { vi: '...', en: '...' } |
| `description` | String | Mô tả chi tiết (giờ hoạt động, liên hệ, khuyến mãi) |
| `keywords` | Array\<String\> | Từ khóa tìm kiếm (ví dụ: ['gà rán', 'chicken', 'fastfood']) |
| `logoUrl` | String | Đường dẫn URL logo thương hiệu |
| `contactInfo` | Object | Thông tin liên hệ: { phone, email, website } |
| `openingHours` | Object | Giờ mở cửa: { mon: '09:00-22:00', ... } |
| `active` | Boolean | true = đang hoạt động tại phòng này, false = đã rời đi (lưu lịch sử) |
| `createdAt` | Date | Thời điểm gắn POI vào phòng |
| `updatedAt` | Date | Thời điểm cập nhật thông tin POI |

---

### 11. nodes
**Mô tả:** Lưu giữ các đỉnh (Vertices) của mạng lưới định tuyến. Có tọa độ 3D cụ thể và loại hành lang, ngã rẽ hay cửa ra vào.
* **Phân vùng:** Graph Mathematics Vertices
* **Quan hệ chính:** Linked to `floors`. Linked to `edges` (điểm đầu/cuối). Grouped by `connectors`. Linked to `located_features` (đối tượng đại diện tương ứng nếu có) và `scheduled_blockages` (các lịch bảo trì chặn nút).

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của nút đồ thị |
| `floorId` | ObjectId | Liên kết tới tầng chứa nút (floors) |
| `locatedFeatureId` | ObjectId | Liên kết tới đối tượng vật lý/thiết bị tương ứng trên sơ đồ (nullable, located_features) |
| `type` | String | Thể loại nút: 'CORRIDOR', 'DOOR', 'JUNCTION', 'ELEVATOR', 'STAIR' |
| `coords` | Object | Hệ tọa độ 3D mét: { x, y, z } (z tính tự động theo cao độ tầng) |
| `active` | Boolean | Trạng thái hoạt động (bảo trì: đặt false để ngưng định tuyến đi qua) |
| `metadata` | Object | Nhãn bổ sung tùy chọn (ví dụ: { label: 'Sảnh Chờ A' }) |
| `createdAt` | Date | Thời điểm tạo nút |
| `updatedAt` | Date | Thời điểm cập nhật nút |

---

### 12. edges
**Mô tả:** Lưu giữ các cạnh (Edges) kết nối trực tiếp giữa các nút kề nhau. Lưu sẵn khoảng cách Euclid để thuật toán A* truy vấn cực nhanh.
* **Phân vùng:** Weighted Routing Paths
* **Quan hệ chính:** Linked to `nodes` (N-N xuất phát - kết thúc), Linked to `scheduled_blockages` (lịch bảo trì chặn đường).

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của cạnh nối |
| `fromNodeId` | ObjectId | Liên kết tới nút xuất phát (nodes) |
| `toNodeId` | ObjectId | Liên kết tới nút kết thúc (nodes) |
| `distance` | Number | Khoảng cách mét Euclid đã tính toán trước (tiết kiệm CPU) |
| `accessible` | Boolean | Đường đi có hỗ trợ xe lăn / người tàn tật hay không |
| `active` | Boolean | Trạng thái đóng/mở đường đi tĩnh để bảo trì |
| `isEscalator` | Boolean | Định vị là thang cuốn (hỗ trợ lọc bộ lọc lộ trình) |
| `isElevator` | Boolean | Định vị là thang máy (hỗ trợ lọc bộ lọc lộ trình) |
| `isStairs` | Boolean | Định vị là thang bộ (hỗ trợ lọc bộ lọc lộ trình) |
| `createdAt` | Date | Thời điểm tạo cạnh |
| `updatedAt` | Date | Thời điểm cập nhật cạnh |

---

### 13. connectors
**Mô tả:** Quản lý hệ thống giao thông đứng (thang máy, thang cuốn, thang bộ), chứa danh sách các nút dừng tương ứng ở từng tầng.
* **Phân vùng:** Global Multi-Floor Bridges
* **Quan hệ chính:** Linked to `floors` và groups các `nodes` để thực hiện chuyển tầng.

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của trục thẳng đứng |
| `buildingId` | ObjectId | Liên kết tới tòa nhà (buildings) |
| `type` | String | Loại cầu nối đứng: 'ELEVATOR', 'STAIR', hoặc 'ESCALATOR' |
| `name` | String | Tên trục thẳng đứng (ví dụ: 'Trục Thang Máy Trung Tâm A') |
| `active` | Boolean | Trạng thái hoạt động toàn bộ trục thang |
| `servedFloors` | Array\<Object\> | Các tầng trục phục vụ và sảnh chờ tương ứng: [{ floorId, nodeId }] |
| `createdAt` | Date | Thời điểm khởi tạo trục đứng |
| `updatedAt` | Date | Thời điểm cập nhật gần nhất |

---

### 14. search_logs
**Mô tả:** Nhật ký lưu trữ cụm từ tìm kiếm và lộ trình của khách hàng nhằm thực hiện báo cáo kinh doanh và thống kê vị trí phổ biến (heatmap).
* **Phân vùng:** Analytics Store
* **Quan hệ chính:** Linked to `buildings` để lọc báo cáo theo tòa nhà.

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của nhật ký tìm kiếm |
| `buildingId` | ObjectId | Liên kết tới tòa nhà diễn ra tìm kiếm (buildings) |
| `startNodeId` | ObjectId | Điểm xuất phát được định tuyến (nodes) |
| `endNodeId` | ObjectId | Điểm đích tìm kiếm của người dùng (nodes) |
| `queryText` | String | Từ khóa tìm kiếm thô người dùng đã gõ |
| `timestamp` | Date | Thời gian thực hiện tìm kiếm |

---

### 15. located_features
**Mô tả:** Bảng lưu trữ thực thể vật thể/thiết bị cụ thể đã được bố trí trên mặt bằng (ví dụ: máy bán nước số hiệu A, camera giám sát số hiệu B, ghế sofa cụ thể). Mỗi đối tượng tham chiếu đến thiết kế mẫu trong thư viện mẫu và có tọa độ, thuộc tính riêng biệt.
* **Phân vùng:** Spatial Instance Layer
* **Quan hệ chính:** Linked to `floors`, `spaces` (nếu có), `feature_libraries` (lấy cấu hình mẫu/BIM catalog), và trỏ tới từ `nodes`.

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của đối tượng được bố trí |
| `floorId` | ObjectId | Liên kết tới tầng chứa đối tượng (floors) |
| `spaceId` | ObjectId | Liên kết tới không gian chứa đối tượng nếu có (nullable, spaces) |
| `libraryId` | ObjectId | Liên kết tới mẫu thiết kế từ thư viện mẫu (feature_libraries) |
| `geometry` | Object | Hệ tọa độ 2D/3D vị trí đặt đối tượng: { x, y, rotation, scale } |
| `customProperties` | Object | Thuộc tính tùy biến ghi đè cho thiết bị cụ thể (serial, ngày bảo trì, trạng thái hoạt động) |
| `createdAt` | Date | Thời điểm tạo bản ghi bố trí |
| `updatedAt` | Date | Thời điểm cập nhật bản ghi bố trí |

---

### 16. feature_libraries
**Mô tả:** Thư viện mẫu dùng chung quản lý danh mục thiết bị, mô hình 3D và tài sản (CAD/BIM catalog) có thể tái sử dụng. Chứa các thông tin về mô hình 3D GLTF, icon hiển thị và thông số mặc định của loại tài sản.
* **Phân vùng:** BIM / CAD Library Catalog
* **Quan hệ chính:** Parent of `located_features` (Được các vật thể bố trí trên mặt sàn tham chiếu).

| Trường (Field) | Kiểu (Type) | Mô tả (Description) |
| :--- | :--- | :--- |
| `_id` | ObjectId | Khóa chính duy nhất của mẫu thư viện |
| `name` | String | Tên loại đối tượng mẫu (ví dụ: 'Camera dome AXIS P3245', 'Ghế sofa đơn') |
| `category` | String | Phân nhóm loại thiết bị (ví dụ: 'security', 'furniture', 'iot', 'signage') |
| `modelUrl` | String | Đường dẫn tải file mô hình 3D định dạng GLTF/GLB |
| `icon` | String | Icon hiển thị trên bản vẽ 2D (tên Lucide icon hoặc CSS class) |
| `defaultProperties` | Object | Các thuộc tính cấu hình mặc định (nhà sản xuất, công suất, độ phân giải) |
| `createdAt` | Date | Thời điểm tạo mẫu thư viện |
| `updatedAt` | Date | Thời điểm cập nhật mẫu thư viện |
