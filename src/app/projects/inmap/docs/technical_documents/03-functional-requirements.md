# 2. Function Requirement

## **1\. TỔNG QUAN HỆ THỐNG & ĐỐI TƯỢNG SỬ DỤNG (ACTORS)**

InMap là nền tảng bản đồ trong nhà và điều hướng không gian đa tầng, cung cấp dịch vụ dưới dạng SaaS (Software-as-a-Service). Hệ thống cho phép các tổ chức số hóa không gian tòa nhà của họ và cung cấp công cụ tìm đường trực quan cho khách tham quan.

Hệ thống phục vụ 4 nhóm đối tượng người dùng chính với các đặc quyền được phân định rõ ràng:

* **SaaS Super Admin (`admin`):** Quản trị viên tối cao của nền tảng, có quyền kiểm soát toàn bộ tài nguyên, quản lý các khách hàng doanh nghiệp (Tenant) và các gói dịch vụ.  
* **Tenant Admin (`building_owner`):** Đại diện cho khách hàng doanh nghiệp (chủ đầu tư, ban quản lý chuỗi tòa nhà). Người này có toàn quyền quản lý cấu hình tổ chức của mình và phân bổ nhân sự quản lý từng tòa nhà.  
* **Facility Staff (`building_manager`):** Nhân viên vận hành, kỹ thuật hoặc quản lý tòa nhà. Đối tượng này trực tiếp thực hiện các thao tác số hóa bản đồ, cập nhật thông tin không gian và xử lý sự cố chặn đường tại các tòa nhà được phân công.  
* **Người dùng cuối (`End-User / Guest`):** Khách tham quan, hành khách hoặc khách hàng có nhu cầu xem bản đồ tương tác, tra cứu thông tin phòng ốc và tìm đường di chuyển bên trong tòa nhà.

## **2\. CHI TIẾT YÊU CẦU CHỨC NĂNG THEO MODULE**

### **2.1. Module Quản trị Nền tảng SaaS (Dành cho `admin`)**

Module này cung cấp các công cụ để Quản trị viên hệ thống kiểm soát mạng lưới khách hàng doanh nghiệp.

* **Yêu cầu FR-SaaS-01 — Quản lý Đối tác và Tổ chức khách hàng:**  
  * *Mô tả:* Quản trị viên có thể thêm mới, chỉnh sửa thông tin hoặc thay đổi trạng thái hoạt động (tạm khóa, kích hoạt) của các tổ chức khách hàng.  
  * *Quy tắc định danh:* Mỗi khách hàng khi được khởi tạo phải gắn liền với một tên miền phụ (subdomain) duy nhất để phục vụ việc truy cập riêng biệt. Quản trị viên thiết lập gói dịch vụ tương ứng cho từng khách hàng.  
* **Yêu cầu FR-SaaS-02 — Khởi tạo tài khoản Chủ quản Doanh nghiệp:**  
  * *Mô tả:* Quản trị viên cấp phát tài khoản quản trị cấp cao nhất (`building_owner`) cho từng tổ chức khách hàng để họ tự vận hành hệ thống nội bộ của mình.  
* **Yêu cầu FR-SaaS-03 — Giám sát Tài nguyên Toàn cục:**  
  * *Mô tả:* Quản trị viên có thể xem tổng quan danh sách toàn bộ các tòa nhà đang sử dụng nền tảng, theo dõi lượng truy cập và trạng thái vận hành của tất cả các tổ chức khách hàng phục vụ cho mục đích thống kê.  
* **Yêu cầu FR-SaaS-04 \- Cấu hình nâng cao**

### **2.2. Module Quản lý Tài khoản & Phân quyền Doanh nghiệp (Dành cho `building_owner`)**

Module này giúp chủ doanh nghiệp quản lý danh mục bất động sản và nhân sự của tổ chức.

* **Yêu cầu FR-OWN-01 — Khai báo và Quản lý Tòa nhà:**  
  * *Mô tả:* Chủ doanh nghiệp có thể tạo mới hồ sơ tòa nhà, cập nhật thông tin tổng quan (tên, địa chỉ, mô tả) của các tòa nhà thuộc quyền sở hữu. Hệ thống tự động đảm bảo dữ liệu này chỉ hiển thị trong nội bộ tổ chức của họ.  
* **Yêu cầu FR-OWN-02 — Quản lý Nhân sự Vận hành:**  
  * *Mô tả:* Chủ doanh nghiệp có thể tạo các tài khoản nhân viên cấp dưới và cấp quyền quản lý (`building_manager`) để cùng tham gia vận hành hệ thống bản đồ.  
* **Yêu cầu FR-OWN-03 — Phân quyền quản lý theo khu vực/tòa nhà cụ thể:**  
  * *Mô tả:* Chủ doanh nghiệp có thể giới hạn quyền của từng nhân viên. Một nhân viên có thể chỉ được phép xem và biên tập bản đồ trên một hoặc một vài tòa nhà được chỉ định thay vì toàn bộ chuỗi tòa nhà của doanh nghiệp. Nhân viên sẽ không nhìn thấy hoặc can thiệp được vào dữ liệu của các tòa nhà không được giao phó.

### **2.3. Module Biên tập & Quản lý Bản đồ CMS (Dành cho `building_manager` & `building_owner`)**

Đây là module cốt lõi cung cấp các công cụ số hóa không gian và quản lý điều hướng.

* **Yêu cầu FR-CMS-01 — Quản lý Danh sách Tầng:**  
  * *Mô tả:* Người quản lý có thể thêm mới, sắp xếp thứ tự và cập nhật thông tin các tầng cho một tòa nhà cụ thể.  
  * *Quy tắc:* Mỗi tầng trong cùng một tòa nhà phải có số tầng phân biệt để tránh nhầm lẫn.  
* **Yêu cầu FR-CMS-02 — Nhập Sơ đồ và Số hóa tự động bằng AI:**  
  * *Mô tả:* Người quản lý tải lên một hình ảnh sơ đồ mặt bằng (floor plan) của tầng. Hệ thống tích hợp AI sẽ phân tích hình ảnh và tự động nhận diện, vẽ phác thảo thành một bản đồ 2D chứa các cấu trúc cơ bản như tường bao, các gian phòng và cửa ra vào.  
* **Yêu cầu FR-CMS-03 — Chỉnh sửa Bản đồ 2D tương tác:**  
  * *Mô tả:* Dựa trên bản đồ 2D đã được AI tạo ra, người quản lý có thể sử dụng các công cụ vẽ trực quan trên giao diện để tự do tinh chỉnh. Họ có thể:  
    * Thay đổi kích thước, hình dáng các căn phòng.  
    * Thêm mới, di chuyển hoặc xóa các cửa ra vào, lối đi.  
    * Gán loại hình không gian (phòng họp, hành lang, khu vực mở) và đặt tên cho các khu vực.  
* **Yêu cầu FR-CMS-04 — Tự động thiết lập Mạng lưới Điều hướng:**  
  * *Mô tả:* Sau khi người quản lý hoàn tất việc tinh chỉnh bản đồ 2D và bấm lưu, hệ thống sẽ tự động tính toán, sinh ra các điểm nút (nodes) và đường nối (edges) ẩn bên dưới bản đồ. Người quản lý không cần phải tự vẽ các tuyến đường đi bộ theo cách thủ công.  
* **Yêu cầu FR-CMS-05 — Quản lý Phiên bản Bản đồ:**  
  * *Mô tả:* Người quản lý có thể lưu bản đồ đang làm việc dưới dạng "Bản nháp" (Draft). Khi bản đồ đã hoàn thiện, họ có thể "Xuất bản" (Publish) để cập nhật hiển thị ngay lập tức tới người dùng cuối. Các phiên bản cũ có thể được lưu trữ để phục hồi khi cần.  
* **Yêu cầu FR-CMS-06 — Thiết lập Điểm Tiện ích / Địa điểm hấp dẫn (POI):**  
  * *Mô tả:* Người quản lý có thể ghim các biểu tượng tiện ích (như nhà vệ sinh, quầy lễ tân, bình chữa cháy, máy ATM) lên các vị trí cụ thể trên bản đồ, đặt tên và phân loại chúng để khách tham quan dễ dàng tìm kiếm.  
* **Yêu cầu FR-CMS-07 — Quản lý Điểm Kết nối Liên tầng (Connectors):**  
  * *Mô tả:* Người quản lý có thể định nghĩa các khu vực cầu thang bộ, thang cuốn hoặc thang máy, đồng thời khai báo danh sách các tầng mà hệ thống thang này đi qua để hệ thống tính toán đường đi xuyên tầng.  
* **Yêu cầu FR-CMS-08 — Quản lý Chặn đường / Xử lý Sự cố Vận hành:**  
  * *Mô tả:* Khi có khu vực bảo trì, dọn dẹp hoặc sự cố, người quản lý có thể đặt cảnh báo "chặn đường" tạm thời tại một căn phòng, một lối đi hoặc một khu vực cụ thể trên bản đồ trong 1 khoảng thời gian (lập lịch). Hệ thống sẽ ngay lập tức ngừng chỉ đường khách tham quan đi qua khu vực này trong thời gian sự cố diễn ra.

### **2.4. Module Tìm đường & Bản đồ Tương tác (Dành cho `end-user/guest`)**

Module này cung cấp giao diện trực quan trên thiết bị cá nhân hoặc Kiosk để khách tương tác với tòa nhà.

* **Yêu cầu FR-USER-01 — Trải nghiệm Bản đồ 3D Tương tác:**  
  * *Mô tả:* Khách tham quan được trải nghiệm bản đồ dưới dạng không gian khối 3D trực quan. Người dùng có thể sử dụng thao tác chuột hoặc cảm ứng để thu phóng (zoom), xoay nhiều góc độ và dịch chuyển bản đồ một cách tự do.  
* **Yêu cầu FR-USER-02 — Bộ lọc và Chuyển đổi Tầng linh hoạt:**  
  * *Mô tả:* Người dùng có thể chọn xem chi tiết từng tầng một, hoặc chọn hiển thị toàn bộ các tầng của tòa nhà cùng lúc để dễ dàng hình dung cấu trúc không gian theo chiều dọc.  
* **Yêu cầu FR-USER-03 — Hiển thị Nhãn thông minh (Smart Labels):**  
  * *Mô tả:* Khi người dùng thu phóng bản đồ, hệ thống sẽ tự động hiển thị hoặc ẩn bớt các tên phòng, biểu tượng tiện ích (POI) sao cho bản đồ luôn giữ được độ gọn gàng, trực quan và không bị rối mắt chữ.  
* **Yêu cầu FR-USER-04 — Tra cứu và Tìm kiếm Địa điểm:**  
  * *Mô tả:* Người dùng có thể nhập tên phòng, tên cửa hàng, hoặc danh mục tiện ích vào thanh tìm kiếm. Hệ thống sẽ lọc kết quả và làm nổi bật vị trí đó trên bản đồ.  
* **Yêu cầu FR-USER-05 — Xác định Vị trí hiện tại nhanh chóng:**  
  * *Mô tả:* Người dùng có thể tự chọn "Vị trí của tôi" bằng cách click trực tiếp lên bản đồ, hoặc sử dụng camera quét mã QR được dán tại các cột/bảng thông báo trong tòa nhà để hệ thống tự động xác định vị trí đứng hiện tại.  
* **Yêu cầu FR-USER-06 — Tìm đường đi trong cùng một tầng (Local Routing):**  
  * *Mô tả:* Khi người dùng chọn điểm xuất phát và điểm đến trên cùng một tầng, hệ thống sẽ vẽ một đường line đồ họa chỉ dẫn lộ trình đi bộ ngắn nhất, xuyên qua các hành lang và lối đi mở.  
* **Yêu cầu FR-USER-07 — Tìm đường đi liên tầng (Multi-floor Routing):**  
  * *Mô tả:* Khi điểm xuất phát và điểm đến nằm ở hai tầng khác nhau, hệ thống sẽ hướng dẫn người dùng đi đến hệ thống thang máy hoặc thang bộ tối ưu nhất. Bản đồ sẽ chỉ dẫn đường đến thang, thông báo việc đổi tầng, và tiếp tục vẽ đường đi từ cửa thang ở tầng đích đến căn phòng mong muốn.  
* **Yêu cầu FR-USER-08 — Hướng dẫn chi tiết từng bước:**  
  * *Mô tả:* Đi kèm với đường vẽ trên bản đồ, người dùng nhận được một danh sách các chỉ dẫn bằng văn bản (ví dụ: "Đi thẳng, rẽ trái tại ngã rẽ, đi vào thang máy để lên Tầng 2"). Hệ thống cũng cung cấp thông tin ước tính tổng khoảng cách và thời gian di chuyển.  
* **Yêu cầu FR-USER-09 — Tùy chọn Lộ trình Tiếp cận Ưu tiên (Accessibility Mode):**  
  * *Mô tả:* Người dùng có thể bật chế độ "Ưu tiên xe lăn / Xe đẩy". Khi đó, hệ thống sẽ tự động loại bỏ các lối đi có bậc thang và chỉ hướng dẫn người dùng di chuyển bằng các tuyến đường bằng phẳng hoặc hệ thống thang máy.

