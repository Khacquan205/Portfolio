# 4. Sơ đồ trang web (SiteMap)

Sơ đồ SiteMap dưới đây thể hiện cấu trúc các chức năng và luồng tương tác trên giao diện người dùng của hệ thống InMap đối với từng nhóm đối tượng cụ thể (Khách vãng lai, Chủ tòa nhà, Quản lý tòa nhà và Quản trị viên hệ thống).

[![SiteMap](/projects/inmap/sitemap.png)](/projects/inmap/sitemap.pdf)

## **1. LUỒNG TRUY CẬP DÀNH CHO KHÁCH VÃNG LAI (GUEST / VISITOR)**

Đây là phân hệ giao diện công cộng, không yêu cầu đăng nhập tài khoản, giúp người dùng cuối định vị và tìm đường đi trong tòa nhà.

* **Landing page:** Giao diện trang chủ giới thiệu dịch vụ và cung cấp lối vào cho các nhóm người dùng. Từ đây khách vãng lai có thể xem các thông tin giới thiệu chung (About), thông tin liên hệ (Contact) và biểu phí dịch vụ (Subscription plans).
* **Login & Signup:** Trang đăng nhập và đăng ký dành cho các tài khoản quản trị doanh nghiệp và quản trị vận hành.
* **Map View (Bản đồ tương tác):** Giao diện lõi của khách vãng lai để xem bản đồ 3D và tìm đường:
  * **Search (Tìm kiếm):** Cho phép gõ tìm kiếm các phòng, gian hàng hoặc dịch vụ trong tòa nhà.
    * **QR Code:** Quét mã QR tại thực địa để định vị nhanh điểm xuất phát trên bản đồ.
  * **Destination detail (Chi tiết địa điểm):** Hiển thị các thông tin chi tiết của phòng hoặc tiện ích được click chọn.
  * **Navigation (Điều hướng):** Giao diện chỉ đường trực quan hiển thị đường đi 3D vẽ trên bản đồ kèm bảng chỉ dẫn đường đi từng bước (hướng rẽ, khoảng cách, đổi tầng...).

---

## **2. PHÂN HỆ QUẢN TRỊ DÀNH CHO CHỦ TÒA NHÀ (BUILDING OWNER)**

Trang tổng quan quản trị dành cho chủ đầu tư doanh nghiệp (Tenant), chịu trách nhiệm quản lý vận hành toàn chuỗi bất động sản và các gói dịch vụ đăng ký.

* **Building Owner Homepage:** Giao diện trang chủ của Chủ tòa nhà sau khi đăng nhập:
  * **Dashboard:** Bảng điều khiển trung tâm hiển thị các số liệu thống kê tổng hợp: Tổng số lượng tòa nhà, lượng truy cập của khách tham quan trên toàn hệ thống siêu thị/chuỗi tòa nhà và trạng thái hiệu lực của gói dịch vụ SaaS.
  * **Buildings Management (Quản lý tòa nhà):** Khai báo danh mục tòa nhà, cập nhật thông tin chi tiết từng tòa nhà.
  * **Staff & RBAC (Nhân viên & Phân quyền):** Tạo tài khoản quản lý và gán quyền truy cập (Building Manager) cho nhân viên quản lý từng tòa nhà cụ thể.
  * **Billing & Subscription (Hóa đơn & Đăng ký gói):** Quản lý tình trạng sử dụng gói dịch vụ.
    * **Payment Management (Quản lý thanh toán):** Cổng kết nối thanh toán nâng cấp/gia hạn gói qua Stripe/PayOS.
    * **Financial Reports (Báo cáo tài chính):** Xuất lịch sử giao dịch và hóa đơn thanh toán.
  * **Analytics & Reports (Thống kê & Báo cáo):** Theo dõi biểu đồ lưu lượng truy cập và xu hướng hành vi của khách tham quan.

---

## **3. PHÂN HỆ QUẢN TRỊ DÀNH CHO QUẢN LÝ TÒA NHÀ (BUILDING MANAGER)**

Phân hệ dành cho nhân viên vận hành kỹ thuật (Facility Staff), chịu trách nhiệm trực tiếp số hóa bản đồ và thiết lập trạng thái hoạt động thực địa của tòa nhà được giao.

* **Building Manager Homepage:** Giao diện làm việc của Quản lý tòa nhà:
  * **Dashboard:** Xem các thông tin phân tích vận hành nhanh:
    * **Danh sách "Từ khóa bị bỏ lỡ":** Thống kê các từ khóa khách hàng tìm kiếm nhiều nhưng hệ thống chưa có dữ liệu để kịp thời bổ sung thông tin phòng/POI.
    * **Widget Biểu đồ & Heatmap:** Biểu đồ mật độ tìm kiếm và heatmap lưu lượng di chuyển trên bản đồ giúp tối ưu vị trí quầy kệ.
  * **Floors Management (Quản lý tầng):** Quản lý danh sách các tầng trong tòa nhà.
    * **Floor Map (Bản đồ tầng):** Xem danh sách và trạng thái bản đồ các tầng.
    * **Map Editor Workspace (Trình biên tập bản đồ):** Giao diện Canvas thiết kế kéo thả bản đồ 2D/3D, hỗ trợ dựng tường, chia phòng, tạo kết nối cầu thang (Connector) liên tầng, sinh mạng lưới nodes/edges tự động, quản lý bản nháp (Draft) và xuất bản (Publish).
  * **Room Management (Quản lý phòng):** Quản lý danh mục và thông tin chi tiết từng phòng.
  * **Maintenance Management (Quản lý bảo trì):** Thiết lập lịch khóa/bảo trì tạm thời một phần hành lang hoặc thang máy. Hệ thống định vị sẽ tự động tính toán tránh các khu vực này khi chỉ đường cho khách trong thời gian bảo trì.

---

## **4. PHÂN HỆ QUẢN TRỊ NỀN TẢNG (SYSTEM ADMIN)**

Phân hệ dành cho nhà phát triển hệ thống SaaS InMap, quản lý toàn bộ các khách hàng doanh nghiệp và các thông số vận hành nền tảng.

* **Admin Dashboard:** Xem tổng quan tình hình kinh doanh, số lượng đối tác (Tenants) sử dụng hệ thống và doanh thu tổng.
* **User Management (Quản lý người dùng):** Quản lý, cấp phát, khóa/mở khóa tất cả tài khoản trong hệ thống (Admin, Owners, Managers).
* **Configuration (Cấu hình hệ thống):** Cấu hình chung cho toàn bộ nền tảng.
  * **AI Model Provider:** Thiết lập thông tin kết nối API với các nhà cung cấp mô hình AI (như OpenAI, Gemini) phục vụ tính năng số hóa bản đồ tự động.
* **Plans Management (Quản lý gói dịch vụ):** Định nghĩa cấu hình các gói dịch vụ SaaS cung cấp cho các chủ tòa nhà.
  * **Subscription Grace Period (Thời gian gia hạn nợ):** Cấu hình số ngày cho phép khách hàng gia hạn nợ cước trước khi hệ thống chính thức khóa tính năng tài khoản do hết hạn gói.
