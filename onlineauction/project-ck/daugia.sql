/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80018
 Source Host           : localhost:3306
 Source Schema         : daugia

 Target Server Type    : MySQL
 Target Server Version : 80018
 File Encoding         : 65001

 Date: 25/12/2019 16:15:24
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for camdaugia
-- ----------------------------
DROP TABLE IF EXISTS `camdaugia`;
CREATE TABLE `camdaugia`  (
  `matk` int(50) NOT NULL,
  `masp` int(50) NOT NULL,
  INDEX `FK_maspcam_sanpham`(`masp`) USING BTREE,
  INDEX `FK_matk_taikhoan`(`matk`) USING BTREE,
  CONSTRAINT `FK_maspcam_sanpham` FOREIGN KEY (`masp`) REFERENCES `sanpham` (`masp`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_matk_taikhoan` FOREIGN KEY (`matk`) REFERENCES `taikhoan` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for danhmuc
-- ----------------------------
DROP TABLE IF EXISTS `danhmuc`;
CREATE TABLE `danhmuc`  (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `tendanhmuc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `id_danhmuccha` int(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_DANHMUCCON_DANHMUC`(`id_danhmuccha`) USING BTREE,
  CONSTRAINT `FK_DANHMUCCON_DANHMUC` FOREIGN KEY (`id_danhmuccha`) REFERENCES `danhmuccha` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of danhmuc
-- ----------------------------
INSERT INTO `danhmuc` VALUES (1, 'Ti vi', 1);
INSERT INTO `danhmuc` VALUES (2, 'Điện thoại di động', 1);
INSERT INTO `danhmuc` VALUES (3, 'Máy chụp hình', 1);
INSERT INTO `danhmuc` VALUES (4, 'Quần áo', 2);
INSERT INTO `danhmuc` VALUES (5, 'Máy tính', 1);
INSERT INTO `danhmuc` VALUES (6, 'Trang sức', 2);
INSERT INTO `danhmuc` VALUES (7, 'Phụ kiện laptop', 3);
INSERT INTO `danhmuc` VALUES (8, 'Phụ kiện điện thoại', 3);
INSERT INTO `danhmuc` VALUES (9, 'Sách', 4);
INSERT INTO `danhmuc` VALUES (10, 'Truyện', 4);
INSERT INTO `danhmuc` VALUES (11, 'Cho bé', 5);
INSERT INTO `danhmuc` VALUES (12, 'Cho mẹ', 5);
INSERT INTO `danhmuc` VALUES (13, 'Giày', 2);
INSERT INTO `danhmuc` VALUES (14, 'Balo-Túi xách', 2);

-- ----------------------------
-- Table structure for danhmuccha
-- ----------------------------
DROP TABLE IF EXISTS `danhmuccha`;
CREATE TABLE `danhmuccha`  (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `tendanhmuc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of danhmuccha
-- ----------------------------
INSERT INTO `danhmuccha` VALUES (1, 'Điện tử');
INSERT INTO `danhmuccha` VALUES (2, 'Thời trang');
INSERT INTO `danhmuccha` VALUES (3, 'Phụ kiện');
INSERT INTO `danhmuccha` VALUES (4, 'Sách');
INSERT INTO `danhmuccha` VALUES (5, 'Mẹ và bé');

-- ----------------------------
-- Table structure for ketquadaugia
-- ----------------------------
DROP TABLE IF EXISTS `ketquadaugia`;
CREATE TABLE `ketquadaugia`  (
  `idsp` int(50) NOT NULL,
  `idnguoiban` int(50) NOT NULL,
  `idnguoimua` int(50) NOT NULL,
  `giaban` int(255) NULL DEFAULT NULL,
  `phanhoinguoiban` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `phanhoinguoimua` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`idsp`, `idnguoiban`, `idnguoimua`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for lichsudaugia
-- ----------------------------
DROP TABLE IF EXISTS `lichsudaugia`;
CREATE TABLE `lichsudaugia`  (
  `idnguoimua` int(50) NOT NULL,
  `idsp` int(50) NOT NULL,
  `giadau` int(255) NOT NULL,
  PRIMARY KEY (`idnguoimua`, `idsp`) USING BTREE,
  INDEX `FK_splichsu_sanpham`(`idsp`) USING BTREE,
  CONSTRAINT `FK_nguoimua_taikhoan` FOREIGN KEY (`idnguoimua`) REFERENCES `taikhoan` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_splichsu_sanpham` FOREIGN KEY (`idsp`) REFERENCES `sanpham` (`masp`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for ragia
-- ----------------------------
DROP TABLE IF EXISTS `ragia`;
CREATE TABLE `ragia`  (
  `nguoiragia` int(50) NOT NULL,
  `masp` int(50) NOT NULL,
  `giaduara` int(255) NULL DEFAULT NULL,
  `thoigiantra` datetime(0) NULL DEFAULT NULL,
  INDEX `FK_nguoiragia_taikhoan`(`nguoiragia`) USING BTREE,
  INDEX `FK_masp_sp`(`masp`) USING BTREE,
  CONSTRAINT `FK_masp_sp` FOREIGN KEY (`masp`) REFERENCES `sanpham` (`masp`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_nguoiragia_taikhoan` FOREIGN KEY (`nguoiragia`) REFERENCES `taikhoan` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ragia
-- ----------------------------
INSERT INTO `ragia` VALUES (5, 10, 2810000, '2019-12-16 13:41:47');
INSERT INTO `ragia` VALUES (5, 10, 2810000, '2019-12-16 13:58:02');
INSERT INTO `ragia` VALUES (5, 10, 2810000, '2019-12-16 14:00:19');
INSERT INTO `ragia` VALUES (5, 10, 2820000, '2019-12-16 14:00:24');
INSERT INTO `ragia` VALUES (5, 15, 1935002, '2019-12-16 14:01:56');
INSERT INTO `ragia` VALUES (5, 15, 1945000, '2019-12-16 14:02:40');
INSERT INTO `ragia` VALUES (5, 2, 310000, '2019-12-16 14:20:53');
INSERT INTO `ragia` VALUES (5, 2, 320000, '2019-12-16 14:29:23');
INSERT INTO `ragia` VALUES (5, 28, 1800010000, '2019-12-16 14:37:55');
INSERT INTO `ragia` VALUES (5, 3, 1600010000, '2019-12-16 14:42:05');
INSERT INTO `ragia` VALUES (5, 3, 1600020000, '2019-12-16 14:51:14');
INSERT INTO `ragia` VALUES (5, 3, 1600030000, '2019-12-16 14:54:26');
INSERT INTO `ragia` VALUES (5, 4, 42010000, '2019-12-16 19:27:25');
INSERT INTO `ragia` VALUES (5, 4, 42020000, '2019-12-16 19:34:47');
INSERT INTO `ragia` VALUES (5, 15, 1955000, '2019-12-16 19:37:19');
INSERT INTO `ragia` VALUES (5, 15, 1965000, '2019-12-16 19:38:18');
INSERT INTO `ragia` VALUES (5, 15, 1975000, '2019-12-16 19:45:06');
INSERT INTO `ragia` VALUES (5, 7, 2810000, '2019-12-16 19:52:08');
INSERT INTO `ragia` VALUES (5, 7, 2820000, '2019-12-16 19:54:23');
INSERT INTO `ragia` VALUES (5, 15, 1985000, '2019-12-17 09:10:11');
INSERT INTO `ragia` VALUES (6, 10, 2830000, '2019-12-17 16:13:05');
INSERT INTO `ragia` VALUES (10, 32, 1460000, '2019-12-25 09:24:26');

-- ----------------------------
-- Table structure for sanpham
-- ----------------------------
DROP TABLE IF EXISTS `sanpham`;
CREATE TABLE `sanpham`  (
  `masp` int(50) NOT NULL AUTO_INCREMENT,
  `tensp` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `mota` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `thongtin` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `danhmuc` int(50) NOT NULL,
  `giahientai` int(50) NOT NULL,
  `giamuangay` int(50) NULL DEFAULT NULL,
  `tinhtrang` int(1) NOT NULL,
  `manguoiban` int(50) NOT NULL,
  `solandaugia` int(50) NULL DEFAULT NULL,
  `nguoibandanhgia` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `nguoimuadanhgia` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `tgbatdau` datetime(0) NOT NULL,
  `tgketthuc` datetime(0) NOT NULL,
  `nguoigiugia` int(50) NULL DEFAULT NULL,
  `buocgia` int(50) NULL DEFAULT 100000,
  `giahantudong` int(1) NULL DEFAULT 0,
  `giakhoidiem` int(50) NULL DEFAULT NULL,
  PRIMARY KEY (`masp`) USING BTREE,
  INDEX `FK_sanpham_danhmuc`(`danhmuc`) USING BTREE,
  INDEX `FK_nguoiban_tk`(`manguoiban`) USING BTREE,
  CONSTRAINT `FK_nguoiban_tk` FOREIGN KEY (`manguoiban`) REFERENCES `taikhoan` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_sanpham_danhmuc` FOREIGN KEY (`danhmuc`) REFERENCES `danhmuc` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 122 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sanpham
-- ----------------------------
INSERT INTO `sanpham` VALUES (1, 'Freshwater Cultured Pearl', 'Freshwater Cultured Pearl, Citrine, Peridot & Amethyst Bracelet, 7.5\"', '<UL>\n     <LI>Metal stamp: 14k </LI>\n     <LI>Metal: yellow-ld</LI>\n     <LI>Material Type: amethyst, citrine, ld, pearl, peridot</LI>\n     <LI>Gem Type: citrine, peridot, amethyst</LI>\n     <LI>Length: 7.5 inches</LI>\n     <LI>Clasp Type: filigree-box</LI>\n     <LI>Total metal weight: 0.6 Grams</LI>\n </UL>\n <STRONG>Pearl Information</STRONG><BR>\n <UL>\n     <LI>Pearl type: freshwater-cultured</LI>\n </UL>\n <STRONG>Packaging Information</STRONG><BR>\n <UL>\n     <LI>Package: Regal Blue Sueded-Cloth Pouch</LI>\n </UL>', 6, 1350000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 1350000);
INSERT INTO `sanpham` VALUES (2, 'Pink Sapphire Sterling Silver', '14 1/2 Carat Created Pink Sapphire Sterling Silver Bracelet w/ Diamond Accents', '<P><STRONG>Jewelry Information</STRONG></P>\r\n<UL>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n</UL>\r\n', 6, 288000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-25 09:01:00', NULL, 100000, 0, 288000);
INSERT INTO `sanpham` VALUES (3, 'Torrini KC241', 'Nhẫn kim cương - vẻ đẹp kiêu sa', '<P>Không chỉ có kiểu dáng truyền thống chỉ có một hạt kim cương ở giữa, các nhà thiết kế đã tạo những những chiếc nhẫn vô cùng độc đáo và tinh tế. Tuy nhiên, giá của đồ trang sức này thì chỉ có dân chơi mới có thể kham được.</P>\r\n<UL>\r\n    <LI>Kiểu sản phẩm: Nhẫn nữ</LI>\r\n    <LI>Loại đá: To paz</LI>\r\n    <LI>Chất liệu: kim cương, nguyên liệu và công nghệ Italy...</LI>\r\n    <LI>Đơn giá: 2,110,250 VND / Chiếc</LI>\r\n</UL>\r\n', 6, 1440027000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-24 09:01:00', NULL, 100000, 0, 1440027000);
INSERT INTO `sanpham` VALUES (4, 'Torrini KC242', 'tinh xảo và sang trọng', '<P>Để sở hữu một chiếc nhẫn kim cương lấp lánh trên tay, bạn phải là người chịu chi và sành điệu.<BR>\r\nVới sự kết hợp khéo léo và độc đáo giữa kim cương và Saphia, Ruby... những chiếc nhẫn càng trở nên giá trị.</P>\r\n<UL>\r\n    <LI>Kiểu sản phẩm: Nhẫn nam</LI>\r\n    <LI>Loại đá: To paz</LI>\r\n    <LI>Chất liệu: Vàng tây 24K, nguyên liệu và công nghệ Italy...</LI>\r\n</UL>\r\n', 6, 37818000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-23 09:01:00', NULL, 100000, 0, 37818000);
INSERT INTO `sanpham` VALUES (5, 'Nokia 7610', 'Độ phân giải cao, màn hình màu, chụp ảnh xuất sắc.', '<UL>\r\n    <LI>Máy ảnh có độ phân giải 1 megapixel</LI>\r\n    <LI>Màn hình 65.536 màu, rộng 2,1 inch, 176 X 208 pixel với đồ họa sắc nét, độ phân giải cao</LI>\r\n    <LI>Quay phim video lên đến 10 phút với hình ảnh sắc nét hơn</LI>\r\n    <LI>Kinh nghiệm đa phương tiện được tăng cường</LI>\r\n    <LI>Streaming video &amp; âm thanh với RealOne Player (hỗ trợ các dạng thức MP3/AAC).</LI>\r\n    <LI>Nâng cấp cho những đoạn phim cá nhân của bạn bằng các tính năng chỉnh sửa tự động thông minh</LI>\r\n    <LI>In ảnh chất lượng cao từ nhà, văn phòng, kios và qua mạng</LI>\r\n    <LI>Dễ dàng kết nối vớI máy PC để lưu trữ và chia sẻ (bằng cáp USB, PopPort, công nghệ Bluetooth)</LI>\r\n    <LI>48 nhạc chuông đa âm sắc, True tones. Mạng GSM 900 / GSM 1800 / GSM 1900</LI>\r\n    <LI>Kích thước 109 x 53 x 19 mm, 93 cc</LI>\r\n    <LI>Trọng lượng 118 g</LI>\r\n    <LI>Hiển thị: Loại TFT, 65.536 màu</LI>\r\n    <LI>Kích cở: 176 x 208 pixels </LI>\r\n</UL>\r\n', 2, 2610000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 2610000);
INSERT INTO `sanpham` VALUES (6, 'Áo thun nữ', 'Màu sắc tươi tắn, kiểu dáng trẻ trung', '<UL>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n    <LI>Xuất xứ: Tp Hồ Chí Minh</LI>\r\n</UL>\r\n', 4, 162000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 162000);
INSERT INTO `sanpham` VALUES (7, 'Simen AP75', 'Thiết kế tinh xảo, hiện đại', '<UL>\r\n    <LI>Hình ảnh hoàn hảo, rõ nét ở mọi góc màn hình</LI>\r\n    <LI>Giảm thiểu sự phản chiếu ánh sáng</LI>\r\n    <LI>Menu hiển thị tiếng Việt</LI>\r\n    <LI>Hệ thống hình ảnh thông minh</LI>\r\n    <LI>Âm thanh Hifi Stereo mạnh mẽ</LI>\r\n    <LI>Hệ thống âm lượng thông minh</LI>\r\n    <LI>Bộ nhớ 100 chương trình</LI>\r\n    <LI>Chọn kênh ưa thích</LI>\r\n    <LI>Các kiểu sắp đặt sẵn hình ảnh / âm thanh</LI>\r\n    <LI>Kích thước (rộng x cao x dày): 497 x 458 x 487mm</LI>\r\n    <LI>Trọng lượng: 25kg</LI>\r\n    <LI>Màu: vàng, xanh, bạc </LI>\r\n</UL>\r\n', 2, 2538000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 2538000);
INSERT INTO `sanpham` VALUES (8, 'Áo bé trai', 'Hóm hỉnh dễ thương', '<UL>\r\n    <LI>Quần áo bé trai</LI>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n    <LI>Xuất xứ: Tp Hồ Chí Minh</LI>\r\n</UL>\r\n', 4, 243000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 243000);
INSERT INTO `sanpham` VALUES (9, 'Bông tai nạm hạt rubby', 'Trẻ trung và quý phái', '<UL>\r\n    <LI>Tên sản phẩm: Bông tai nạm hạt rubby</LI>\r\n    <LI>Đóng nhãn hiệu: Torrini</LI>\r\n    <LI>Nguồn gốc, xuất xứ: Italy</LI>\r\n    <LI>Hình thức thanh toán: L/C T/T M/T CASH</LI>\r\n    <LI>Thời gian giao hàng: trong vòng 3 ngày kể từ ngày mua</LI>\r\n    <LI>Chất lượng/chứng chỉ: od</LI>\r\n</UL>\r\n', 6, 2160000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 2160000);
INSERT INTO `sanpham` VALUES (10, 'Đầm dạ hội ánh kim', 'Đủ màu sắc - kiểu dáng', '<UL>\r\n    <LI>Màu sắc: Khuynh hướng ánh kim có thể thể hiện trên vàng, bạc, đỏ tía, xanh biển, vàng tím, trắng và đen.</LI>\r\n    <LI>Một số biến tấu mang tính vui nhộn là vàng chanh, màu hoa vân anh và ngọc lam; trong đó hoàng kim và nhũ bạc khá phổ biến.</LI>\r\n    <LI>Phong cách: Diềm đăng ten, rủ xuống theo chiều thẳng đứng, nhiều lớp, cổ chẻ sâu, eo chít cao tới ngực... được biến tấu tùy theo mỗi nhà thiết kế.</LI>\r\n</UL>\r\n', 4, 2547000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-19 09:01:00', NULL, 100000, 0, 2547000);
INSERT INTO `sanpham` VALUES (11, 'Dây chuyền ánh bạc', 'Kiểu dáng mới lạ', '<UL>\r\n    <LI>Chất liệu chính: Bạc</LI>\r\n    <LI>Màu sắc: Bạc</LI>\r\n    <LI>Chất lượng: Mới</LI>\r\n    <LI>Phí vận chuyển: Liên hệ</LI>\r\n    <LI>Giá bán có thể thay đổi tùy theo trọng lượng và giá vàng của từng thời điểm.</LI>\r\n</UL>\r\n', 6, 225000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 225000);
INSERT INTO `sanpham` VALUES (12, 'Đồ bộ bé gái', 'Đủ màu sắc - kiểu dáng', '<UL>\r\n    <LI>Màu sắc: đỏ tía, xanh biển, vàng tím, trắng và đen.</LI>\r\n    <LI>Xuất xứ: Tp. Hồ Chí Minh</LI>\r\n    <LI>Chất liệu: cotton</LI>\r\n    <LI>Loại hàng: hàng trong nước</LI>\r\n</UL>\r\n', 4, 108000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 108000);
INSERT INTO `sanpham` VALUES (13, 'Đầm dạ hội Xinh Xinh', 'Đơn giản nhưng quý phái', '<P>Những đường cong tuyệt đẹp sẽ càng được phô bày khi diện các thiết kế này.</P>\r\n<UL>\r\n    <LI>Nét cắt táo bạo ở ngực giúp bạn gái thêm phần quyến rũ, ngay cả khi không có trang&nbsp; sức nào trên người.</LI>\r\n    <LI>Đầm hai dây thật điệu đà với nơ xinh trước ngực nhưng trông bạn vẫn toát lên vẻ tinh nghịch và bụi bặm nhờ thiết kế đầm bí độc đáo cùng sắc màu sẫm.</LI>\r\n    <LI>Hãng sản xuất: NEM</LI>\r\n    <LI>Kích cỡ : Tất cả các kích cỡ</LI>\r\n    <LI>Kiểu dáng : Quây/Ống</LI>\r\n    <LI>Chất liệu : Satin</LI>\r\n    <LI>Màu : đen, đỏ</LI>\r\n    <LI>Xuất xứ : Việt Nam</LI>\r\n</UL>\r\n', 4, 2340000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 2340000);
INSERT INTO `sanpham` VALUES (14, 'Đầm dạ hội NEM', 'Táo bạo và quyến rũ', '<P>Những đường cong tuyệt đẹp sẽ càng được phô bày khi diện các thiết kế này.</P>\r\n<UL>\r\n    <LI>Nét cắt táo bạo ở ngực giúp bạn gái thêm phần quyến rũ, ngay cả khi không có trang&nbsp; sức nào trên người.</LI>\r\n    <LI>Đầm hai dây thật điệu đà với nơ xinh trước ngực nhưng trông bạn vẫn toát lên vẻ tinh nghịch và bụi bặm nhờ thiết kế đầm bí độc đáo cùng sắc màu sẫm.</LI>\r\n    <LI>Hãng sản xuất: NEM</LI>\r\n    <LI>Kích cỡ : Tất cả các kích cỡ</LI>\r\n    <LI>Kiểu dáng : Quây/Ống</LI>\r\n    <LI>Chất liệu : Satin</LI>\r\n    <LI>Màu : đen, đỏ</LI>\r\n    <LI>Xuất xứ : Việt Nam</LI>\r\n</UL>\r\n', 4, 1080000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 1080000);
INSERT INTO `sanpham` VALUES (15, 'Dây chuyền đá quý', 'Kết hợp vàng trắng và đá quý', '<UL>\r\n    <LI>Kiểu sản phẩm: Dây chuyền</LI>\r\n    <LI>Chất liệu: Vàng trắng 14K và đá quý, nguyên liệu và công nghệ Italy...</LI>\r\n    <LI>Trọng lượng chất liệu: 1.1 Chỉ </LI>\r\n</UL>\r\n', 6, 1786500, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-20 09:01:00', NULL, 100000, 0, 1786500);
INSERT INTO `sanpham` VALUES (16, 'Nokia N72', 'Sành điệu cùng N72', '<UL>\r\n    <LI>Camera mega pixel : 2 mega pixel</LI>\r\n    <LI>Bộ nhớ trong : 16 - 31 mb</LI>\r\n    <LI>Chức năng : quay phim, ghi âm, nghe đài FM</LI>\r\n    <LI>Hỗ trợ: Bluetooth, thẻ nhớ nài, nhạc MP3 &lt;br/&gt;</LI>\r\n    <LI>Trọng lượng (g) : 124g</LI>\r\n    <LI>Kích thước (mm) : 109 x 53 x 21.8 mm</LI>\r\n    <LI>Ngôn ngữ : Có tiếng việt</LI>\r\n    <LI>Hệ điều hành: Symbian OS 8.1</LI>\r\n</UL>\r\n', 2, 2880000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 2880000);
INSERT INTO `sanpham` VALUES (17, 'Mặt dây chuyền Ruby', 'Toả sáng cùng Ruby', '<UL>\r\n    <LI>Kiểu sản phẩm:&nbsp; Mặt dây</LI>\r\n    <LI>Chất liệu: Vàng trắng 14K, nguyên liệu và công nghệ Italy...</LI>\r\n    <LI>Trọng lượng chất liệu: 0.32 Chỉ</LI>\r\n</UL>\r\n', 6, 1638000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 1638000);
INSERT INTO `sanpham` VALUES (18, '1/2 Carat Pink Sapphire Silver', 'Created Pink Sapphire', '<UL>\r\n    <LI>Brand Name: Ice.com</LI>\r\n    <LI>Material Type: sterling-silver, created-sapphire, diamond</LI>\r\n    <LI>Gem Type: created-sapphire, Diamond</LI>\r\n    <LI>Minimum total gem weight: 14.47 carats</LI>\r\n    <LI>Total metal weight: 15 Grams</LI>\r\n    <LI>Number of stones: 28</LI>\r\n    <LI>Created-sapphire Information</LI>\r\n    <LI>Minimum color: Not Available</LI>\r\n</UL>\r\n', 6, 3060000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 3060000);
INSERT INTO `sanpham` VALUES (19, 'Netaya', 'Dây chuyền vàng trắng', '<UL>\r\n    <LI>Kiểu sản phẩm:&nbsp; Dây chuyền</LI>\r\n    <LI>Chất liệu: Vàng tây 18K, nguyên liệu và công nghệ Italy...</LI>\r\n    <LI>Trọng lượng chất liệu: 1 Chỉ</LI>\r\n</UL>\r\n', 6, 1638000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 1638000);
INSERT INTO `sanpham` VALUES (20, 'Giày nam GN16', 'Êm - đẹp - bề', '<UL>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n    <LI>Xuất xứ: Tp Hồ Chí Minh</LI>\r\n    <LI>Giá: 300 000 VNĐ</LI>\r\n</UL>\r\n', 4, 486000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-30 09:01:00', NULL, 100000, 0, 486000);
INSERT INTO `sanpham` VALUES (21, 'G3.370A', 'Đen bóng, sang trọng', '<UL>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n    <LI>Xuất xứ: Tp Hồ Chí Minh</LI>\r\n</UL>\r\n', 4, 270000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 270000);
INSERT INTO `sanpham` VALUES (22, 'Giày nữ GN1', 'Kiểu dáng thanh thoát', '<UL>\r\n    <LI>Loại hàng: Hàng trong nước</LI>\r\n    <LI>Xuất xứ: Tp Hồ Chí Minh</LI>\r\n</UL>\r\n', 4, 261000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 261000);
INSERT INTO `sanpham` VALUES (23, 'NV002', 'Kiểu dáng độc đáo', '<P><STRONG>Thông tin sản phẩm</STRONG></P>\r\n<UL>\r\n    <LI>Mã sản phẩm: NV002</LI>\r\n    <LI>Trọng lượng: 2 chỉ</LI>\r\n    <LI>Vật liệu chính: Vàng 24K</LI>\r\n</UL>\r\n', 6, 3240000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 3240000);
INSERT INTO `sanpham` VALUES (24, 'NV009', 'Sáng chói - mới lạ', '<P><STRONG>Thông tin sản phẩm</STRONG></P>\r\n<UL>\r\n    <LI>Mã sản phẩm: NV005</LI>\r\n    <LI>Trọng lượng: 1 cây</LI>\r\n    <LI>Vật liệu chính: Vàng 24K</LI>\r\n</UL>\r\n', 6, 13410000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-15 09:01:00', NULL, 100000, 0, 13410000);
INSERT INTO `sanpham` VALUES (25, 'CK010', 'Độc đáo, sang trọng', '<UL>\r\n    <LI>Kiểu dáng nam tính và độc đáo, những thiết kế dưới đây đáp ứng được mọi yêu cần khó tính nhất của người sở hữu.</LI>\r\n    <LI>Những hạt kim cương sẽ giúp người đeo nó tăng thêm phần sành điệu</LI>\r\n    <LI>Không chỉ có kiểu dáng truyền thống chỉ có một hạt kim cương ở giữa, các nhà thiết kế đã tạo những những chiếc nhẫn vô cùng độc đáo và tinh tế.</LI>\r\n    <LI>Tuy nhiên, giá của đồ trang sức này thì chỉ có dân chơi mới có thể kham được</LI>\r\n</UL>\r\n', 6, 1932735282, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 1932735282);
INSERT INTO `sanpham` VALUES (26, 'CK009', 'Nữ tính - đầy quí phái', '<UL>\r\n    <LI>Để sở hữu một chiếc nhẫn kim cương lấp lánh trên tay, bạn phải là người chịu chi và sành điệu.</LI>\r\n    <LI>Với sự kết hợp khéo léo và độc đáo giữa kim cương và Saphia, Ruby... những chiếc nhẫn càng trở nên giá trị</LI>\r\n    <LI>Nhà sản xuất: Torrini</LI>\r\n</UL>\r\n<P>Cái này rất phù hợp cho bạn khi tặng nàng</P>\r\n', 6, 1665000000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 1665000000);
INSERT INTO `sanpham` VALUES (27, 'CK007', 'Sự kết hợp khéo léo, độc đáo', '<UL>\r\n    <LI>Để sở hữu một chiếc nhẫn kim cương lấp lánh trên tay, bạn phải là người chịu chi và sành điệu.</LI>\r\n    <LI>Với sự kết hợp khéo léo và độc đáo giữa kim cương và Saphia, Ruby... những chiếc nhẫn càng trở nên giá trị</LI>\r\n    <LI>Nhà sản xuất: Torrini</LI>\r\n</UL>\r\n<P>Cái này rất phù hợp cho bạn khi tặng nàng</P>\r\n', 6, 1932735282, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-13 09:01:00', NULL, 100000, 0, 1932735282);
INSERT INTO `sanpham` VALUES (28, 'CK005', 'Tinh xảo - sang trọng', '<UL>\r\n    <LI>Kim cương luôn là đồ trang sức thể hiện đẳng cấp của người sử dụng.</LI>\r\n    <LI>Không phải nói nhiều về những kiểu nhẫn dưới đây, chỉ có thể gói gọn trong cụm từ: tinh xảo và sang trọng</LI>\r\n    <LI>Thông tin nhà sản xuất: Torrini</LI>\r\n    <LI>Thông tin chi tiết: Cái này rất phù hợp cho bạn khi tặng nàng</LI>\r\n</UL>\r\n', 6, 1620009000, NULL, 1, 6, 0, NULL, NULL, '2019-12-12 00:00:00', '2019-12-27 09:01:00', NULL, 100000, 0, 1620009000);
INSERT INTO `sanpham` VALUES (29, 'NV01TT', 'Tinh tế đến không ngờ', '<UL>\r\n    <LI>Tinh xảo và sang trọng</LI>\r\n    <LI>Thông tin nhà sản xuất: Torrini</LI>\r\n    <LI>Không chỉ có kiểu dáng truyền thống chỉ có một hạt kim cương ở giữa, các nhà thiết kế đã tạo những những chiếc nhẫn vô cùng độc đáo và tinh tế.</LI>\r\n    <LI>Tuy nhiên, giá của đồ trang sức này thì chỉ có dân chơi mới có thể kham được</LI>\r\n</UL>\r\n', 6, 450000000, NULL, 1, 6, 0, NULL, NULL, '2019-12-15 00:00:00', '2019-12-13 09:01:00', NULL, 100000, 0, 450000000);
INSERT INTO `sanpham` VALUES (30, 'Motorola W377', 'Nữ tính - trẻ trung', '<UL>\r\n    <LI>General: 2G Network, GSM 900 / 1800 / 1900</LI>\r\n    <LI>Size:&nbsp; 99 x 45 x 18.6 mm, 73 cc</LI>\r\n    <LI>Weight: 95 g</LI>\r\n    <LI>Display: type TFT, 65K colors</LI>\r\n    <LI>Size: 128 x 160 pixels, 28 x 35 mm</LI>\r\n</UL>\r\n', 2, 2160000, 5000000, 1, 6, 0, '10', '10', '2019-12-15 00:00:00', '2019-12-24 19:01:00', 7, 100000, 0, 2160000);
INSERT INTO `sanpham` VALUES (31, 'Điện Thoại Xiaomi Redmi Note', 'Mẫu điện thoại Xiaomi Redmi Note 8 được đánh giá là bản nâng cấp hoàn hảo của người đàn anh Redmi Note 7, mẫu smartphone được ví là \"Quốc dân\" trước đây.', '<ul>\r\n<li>Thương hiệu	Xiaomi\r\n<li>Model	Xiaomi Redmi Note 7                </li>\r\n<li>Bộ nhớ trong	64GB                       </li>\r\n<li>Mạng	LTE                                </li>\r\n<li>Khe cắm sim	Dual                           </li>\r\n<li>Chống thấm nước	No                         </li>\r\n<li>Kích thước màn hình (Inches		6.3        </li>\r\n<li>hệ điều hành	Android 9.0                </li>\r\n<li>RAM	4GB                                    </li>\r\n<li>Camera sau	Triple 48MP + 8MP + 13MP       </li>\r\n<li>Camera trước	13MP                       </li>\r\n<li>GPS	Yes                                    </li>\r\n<li>Bluetooth	Có                             </li>\r\n<li>microUSB	2.0 Type-C                     </li>\r\n<li>Pin (mAh)	4000                           </li>\r\n<li>Màu	Nhiều màu                              </li>\r\n<li>Bảo hành (tháng)	12 Tháng               </li>\r\n<li>Kho hàng	675                            </li>\r\n<li>Gửi từ	Quận Long Biên, Hà Nội             </li>\r\n<li>Giá	3.200.000             				   </li>\r\n</ul>', 2, 3200000, NULL, 1, 6, 0, NULL, NULL, '2019-12-23 23:22:37', '2019-12-27 23:22:43', NULL, 100000, 0, 3200000);
INSERT INTO `sanpham` VALUES (32, 'Điện thoại MPhone', 'Điện thoại thông minh MPhone là sản phẩm hợp tác của tập đoàn KMG Hàn Quốc và Mobifone Việt Nam.', '<ul>\r\n<li>Thương hiệu	Mobifone                       </li>\r\n<li>Model	Mobifone Mphone                    </li>\r\n<li>Bộ nhớ trong	32GB                       </li>\r\n<li>Mạng	LTE                                </li>\r\n<li>Khe cắm sim	Dual                           </li>\r\n<li>Chống thấm nước	No                         </li>\r\n<li>Kích thước màn hình (Inches)	5.9        </li>\r\n<li>hệ điều hành	Android 7.0                </li>\r\n<li>RAM	4GB                                    </li>\r\n<li>Camera sau	13MP                           </li>\r\n<li>Camera trước	8MP                        </li>\r\n<li>GPS	Yes                                    </li>\r\n<li>Bluetooth	Có                             </li>\r\n<li>microUSB	Type-C                         </li>\r\n<li>Pin (mAh)	3800                           </li>\r\n<li>Màu	Đen                                    </li>\r\n<li>Bảo hành (tháng)	1 Tháng                </li>\r\n<li>Kho hàng	353                            </li>\r\n<li>Gửi từ	Quận Hoàng Mai, Hà Nội             </li>\r\n<li>Giá	1.450.000             				   </li>\r\n</ul>', 2, 1460000, NULL, 1, 6, 1, NULL, NULL, '2019-12-24 09:19:12', '2019-12-27 23:26:15', 10, 100000, 0, 1450000);

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions`  (
  `session_id` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `expires` int(50) NOT NULL,
  `data` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  PRIMARY KEY (`session_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sessions
-- ----------------------------
INSERT INTO `sessions` VALUES ('k3zKkmp5HHGh00j9FhPmlELd2hnnJD4i', 1577327214, '{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"isLogged\":true,\"account\":{\"id\":10,\"name\":\"Nguyễn Văn Toản\",\"email\":\"tan@gmail.com\",\"dob\":\"19-10-2020\",\"permission\":0,\"gender\":\"1\",\"positivepoint\":null,\"negativepoint\":null}}');

-- ----------------------------
-- Table structure for taikhoan
-- ----------------------------
DROP TABLE IF EXISTS `taikhoan`;
CREATE TABLE `taikhoan`  (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `matkhau` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ten` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `ngaysinh` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `gioitinh` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `diemcong` int(255) NULL DEFAULT NULL,
  `quyenhan` int(10) NOT NULL,
  `diachi` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `diemtru` int(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of taikhoan
-- ----------------------------
INSERT INTO `taikhoan` VALUES (5, 'dreamleage1999@gmail.com', '$2a$10$4iV2jheVhNMvvhFSr7EDSur7CBFFhCFpRGyce0wFoF0rBxH4P.X0y$2a$10$4iV2jheVhNMvvhFSr7EDSu', 'Hà Duy Tân', '2004-12-20', '1', 10, 2, NULL, 0);
INSERT INTO `taikhoan` VALUES (6, 'dreamleage2000@gmail.com', '$2a$10$inwRs8G.KbX1TwJhCFLe3OIyzqFoqwFXqimXJPqH13X38yxSW5CgK$2a$10$inwRs8G.KbX1TwJhCFLe3O', 'Nguyễn Văn AAA', '2028-11-20T00:00', '1', NULL, 1, NULL, NULL);
INSERT INTO `taikhoan` VALUES (7, 'hanhnguyen18011998@gmail.com', '$2a$10$X1DnW2jcutfZ9V7RUZjp1.RAoVGpMaTdx6kAw3ML3KjUJ6wjMlEfW$2a$10$X1DnW2jcutfZ9V7RUZjp1.', 'Hạnh Nguyên', '2018-01-19T00:00', '0', NULL, 0, NULL, NULL);
INSERT INTO `taikhoan` VALUES (10, 'tan@gmail.com', '$2a$10$wWCYCNJZV2tWAN7WwVo6K.CbwA4Zlf51P8ogRRiXvnwnbcGwJt&#x2F;ce$2a$10$wWCYCNJZV2tWAN7WwVo6K.', 'Nguyễn Văn Toản', '2020-10-19T00:00', '1', NULL, 0, 'Đồng Tháp', NULL);

-- ----------------------------
-- Table structure for theodoi
-- ----------------------------
DROP TABLE IF EXISTS `theodoi`;
CREATE TABLE `theodoi`  (
  `nguoitheodoi` int(50) NOT NULL,
  `masp` int(50) NOT NULL,
  INDEX `FK_nguoitheodoi`(`nguoitheodoi`) USING BTREE,
  INDEX `FK_masp_sanpham`(`masp`) USING BTREE,
  CONSTRAINT `FK_masp_sanpham` FOREIGN KEY (`masp`) REFERENCES `sanpham` (`masp`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of theodoi
-- ----------------------------
INSERT INTO `theodoi` VALUES (5, 2);
INSERT INTO `theodoi` VALUES (5, 2);
INSERT INTO `theodoi` VALUES (6, 32);
INSERT INTO `theodoi` VALUES (10, 32);
INSERT INTO `theodoi` VALUES (10, 32);
INSERT INTO `theodoi` VALUES (10, 1);

-- ----------------------------
-- Table structure for xinban
-- ----------------------------
DROP TABLE IF EXISTS `xinban`;
CREATE TABLE `xinban`  (
  `id` int(50) NOT NULL AUTO_INCREMENT,
  `idnguoixin` int(50) NOT NULL,
  `tgbatdau` datetime(0) NULL DEFAULT NULL,
  `tghethan` datetime(0) NULL DEFAULT NULL,
  `trangthai` int(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK_nguoixin_taikhoan`(`idnguoixin`) USING BTREE,
  CONSTRAINT `FK_nguoixin_taikhoan` FOREIGN KEY (`idnguoixin`) REFERENCES `taikhoan` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of xinban
-- ----------------------------
INSERT INTO `xinban` VALUES (2, 5, '2019-12-16 23:06:00', '2019-12-18 15:59:36', 0);
INSERT INTO `xinban` VALUES (3, 5, '2019-12-16 23:06:00', '2019-12-24 00:00:00', 1);
INSERT INTO `xinban` VALUES (4, 6, '2019-12-17 16:03:00', '2019-12-24 00:00:00', 1);
INSERT INTO `xinban` VALUES (5, 7, '2019-12-17 16:38:00', NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
