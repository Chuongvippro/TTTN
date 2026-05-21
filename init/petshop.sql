-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: petshop
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `blog_categories`
--

DROP TABLE IF EXISTS `blog_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_categories`
--

LOCK TABLES `blog_categories` WRITE;
/*!40000 ALTER TABLE `blog_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_comments`
--

DROP TABLE IF EXISTS `blog_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_comment_post` (`post_id`),
  KEY `fk_comment_user` (`user_id`),
  CONSTRAINT `fk_comment_post` FOREIGN KEY (`post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_comment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_comments`
--

LOCK TABLES `blog_comments` WRITE;
/*!40000 ALTER TABLE `blog_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `blog_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blog_posts`
--

DROP TABLE IF EXISTS `blog_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `summary` text,
  `content` longtext,
  `thumbnail` varchar(255) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `author_id` int DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'draft',
  `views` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_posts`
--

LOCK TABLES `blog_posts` WRITE;
INSERT INTO `blog_posts` (`id`, `title`, `slug`, `summary`, `content`, `thumbnail`, `category_id`, `author_id`, `status`, `views`, `created_at`, `updated_at`) VALUES 
(1,'Hành Trình Nhận Nuôi Thú Cưng...','hanh-trinh-nhan-nuoi-thu-cung-1778076247416','Câu chuyện cảm động...','<p>Mỗi năm...</p>','uploads/blog_1.jpg',1,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(2,'Chế Độ Dinh Dưỡng Chuẩn...','che-do-dinh-duong-cho-cho-truong-thanh-1778076247417','Hướng dẫn chi tiết...','<p>Chế độ...</p>','uploads/blog_2.jpg',3,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(3,'Bí Quyết Chăm Sóc Lông Mèo...','bi-quyet-cham-soc-long-meo-bong-muot-1778076247418','Từ chải lông...','<p>Bộ lông...</p>','uploads/blog_3.jpg',2,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(4,'Lịch Tiêm Phòng Cho Chó Mèo...','lich-tiem-phong-cho-cho-meo-1778076247419','Hướng dẫn lịch...','<p>Tiêm phòng...</p>','uploads/blog_4.jpg',4,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(5,'10 Đồ Chơi Giúp Chó Mèo...','do-choi-giup-cho-meo-van-dong-1778076247420','Danh sách đồ chơi...','<p>Thú cưng...</p>','uploads/blog_5.jpg',5,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(6,'10 Dấu Hiệu Chó Bị Ốm...','dau-hieu-cho-bi-om-can-gap-bac-si-1778076247421','Chó không thể nói...','<p>Thú cưng...</p>','uploads/blog_6.jpg',4,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(7,'Mèo Có Cần Tắm Không?...','huong-dan-tam-meo-dung-cach-1778076247422','Sự thật về việc...','<p>Khác với...</p>','uploads/blog_7.jpg',2,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(8,'Nuôi Chó Poodle...','nuoi-cho-poodle-cach-cham-soc-1778076247423','Chó Poodle thông minh...','<p>Poodle đứng đầu...</p>','uploads/blog_8.jpg',1,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(9,'Cách Huấn Luyện Chó Nghe Lời...','cach-huan-luyen-cho-nghe-loi-1778076247424','Phương pháp huấn luyện...','<p>Một chú chó...</p>','uploads/blog_9.jpg',5,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(10,'Câu Chuyện Cảm Động: Chú Chó Cứu Chủ...','cau-chuyen-cho-cuu-chu-trong-dem-lu-1778076247425','Câu chuyện có thật...','<p>Đêm tháng 10...</p>','uploads/blog_10.jpg',1,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(11,'Hướng Dẫn Vệ Sinh Tai Và Mắt...','ve-sinh-tai-mat-cho-thu-cung-tai-nha-1778076247426','Tai và mắt là...','<p>Tai và mắt...</p>','uploads/blog_11.jpg',5,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08'),
(12,'Chọn Chuồng Và Nệm Ngủ...','chon-chuong-nem-ngu-cho-cho-meo-1778076247427','Hướng dẫn chọn...','<p>Thú cưng ngủ...</p>','uploads/blog_12.jpg',5,NULL,'published',0,'2026-05-06 14:04:08','2026-05-06 14:04:08');
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_id` (`cart_id`,`product_id`),
  KEY `fk_cartitem_product` (`product_id`),
  CONSTRAINT `fk_cartitem_cart` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cartitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (16,1,82,1,'2026-05-08 08:10:14');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,6,'2026-04-27 09:07:31'),(2,3,'2026-04-27 14:53:56');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Thức ăn cho chó','Các loại thức ăn cho chó không cho mèo','active'),(2,'Phụ kiện','Bát ăn, đồ chơi, phụ kiện thú cưng','active'),(3,'Cát vệ sinh','Cát vệ sinh dành cho mèo','active'),(4,'Chuồng','Chuồng, nhà cho thú cưng','active'),(5,'Dây dẫn','Dây dắt, dây xích cho chó mèo','active'),(11,'Thức ăn cho mèo','Thức ăn cho mèo không cho chó','active');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_orderitem_order` (`order_id`),
  KEY `fk_orderitem_product` (`product_id`),
  CONSTRAINT `fk_orderitem_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_orderitem_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,26,'Hạt cho chó lớn Pedigree 1.5kg',35000.00,1,'uploads/do_an1.jpg'),(2,2,27,'Hạt cho chó pull Pháp',44000.00,1,'uploads/do_an2.jpg'),(3,3,27,'Hạt cho chó pull Pháp',44000.00,1,'uploads/do_an2.jpg'),(4,3,32,'Vòng Cổ Chó Mèo Có Chuông Dày 1cm',15000.00,1,'uploads/paddy-7766382149889.jpg'),(5,4,29,'Hạt cho chó trưởng thành từ pháp',121000.00,1,'uploads/do_an4.jpg'),(6,5,30,'Súp thưởng cho chó lớn',85000.00,1,'uploads/do_an5.jpg'),(7,6,27,'Hạt cho chó pull Pháp',44000.00,1,'uploads/do_an2.jpg'),(8,7,27,'Hạt cho chó pull Pháp',44000.00,3,'uploads/do_an2.jpg'),(9,8,26,'Hạt cho chó lớn Pedigree 1.5kg',35000.00,2,'uploads/do_an1.jpg'),(10,8,27,'Hạt cho chó pull Pháp',44000.00,2,'uploads/do_an2.jpg'),(11,9,27,'Hạt cho chó pull Pháp',44000.00,3,'uploads/do_an2.jpg'),(12,9,31,'Bình Bú Sữa Cho Chó Mèo Con',35000.00,4,'uploads/paddy-7745698300161.jpg');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `full_name` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `note` text,
  `payment_method` enum('cash','transfer') NOT NULL DEFAULT 'cash',
  `status` enum('pending','confirmed','shipping','delivered','cancelled') NOT NULL DEFAULT 'pending',
  `total_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_order_user` (`user_id`),
  CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,NULL,'Chương Nguyên','0383385580','64 dduwonfg so 8','1312','cash','pending',35000.00,'2026-05-06 14:47:45','2026-05-06 14:47:45'),(2,NULL,'nguyên','1231','64 dduwonfg so 8','313131','cash','pending',44000.00,'2026-05-06 14:48:14','2026-05-06 14:48:14'),(3,NULL,'Chương Nguyên','0383385580','64 dduwonfg so 8','11111111111111111111','cash','pending',59000.00,'2026-05-06 14:59:27','2026-05-06 14:59:27'),(4,NULL,'111','0383385580','1','1','cash','pending',121000.00,'2026-05-06 14:59:53','2026-05-06 14:59:53'),(5,6,'1231','131','13131','313131','cash','cancelled',85000.00,'2026-05-06 15:00:23','2026-05-06 15:04:30'),(6,6,'dũng nguyễn','01923131','64 dduwonfg so 8','11111111111111111','cash','cancelled',44000.00,'2026-05-07 05:37:39','2026-05-09 16:33:42'),(7,NULL,'Chương Nguyên','0383385580','64 dduwonfg so 8','1111111111','cash','pending',132000.00,'2026-05-07 05:50:29','2026-05-07 05:50:29'),(8,6,'nguyễn huy','0282285580','123 a cao lỗi quận 8','giao vào buổi trưa','cash','pending',158000.00,'2026-05-07 06:06:39','2026-05-10 11:03:30'),(9,6,'nguyễn quang huy','0123456789','116a ấp tân thuận tân hòa','giao nhanh nhé','cash','delivered',272000.00,'2026-05-07 06:10:52','2026-05-09 05:03:30');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int DEFAULT '0',
  `category_id` int DEFAULT NULL,
  `pet_type` enum('dog','cat','both') DEFAULT 'both',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('active','inactive') DEFAULT 'active',
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (26,'Hạt cho chó lớn Pedigree 1.5kg',NULL,35000.00,100,1,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/do_an1.jpg'),(27,'Hạt cho chó pull Pháp',NULL,44000.00,97,1,'both','2026-05-06 02:48:47','2026-05-07 06:10:52','active','uploads/do_an2.jpg'),(28,'Hạt cho chó con',NULL,65000.00,100,1,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/do_an3.jpg'),(29,'Hạt cho chó trưởng thành từ pháp',NULL,121000.00,100,1,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/do_an4.jpg'),(30,'Súp thưởng cho chó lớn',NULL,85000.00,100,1,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/do_an5.jpg'),(31,'Bình Bú Sữa Cho Chó Mèo Con',NULL,35000.00,96,2,'both','2026-05-06 02:48:47','2026-05-07 06:10:52','active','uploads/paddy-7745698300161.jpg'),(32,'Vòng Cổ Chó Mèo Có Chuông Dày 1cm',NULL,15000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7766382149889.jpg'),(33,'Dây Dắt Yếm Thoáng Khí Diamond Cho Chó Mèo',NULL,75000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7986830737665.jpg'),(34,'Đồ Chơi Cho Mèo Cần Câu Mèo Co Giãn FOFOS',NULL,40000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8042238148865.jpg'),(35,'Dây Dắt Kèm Vòng Cổ Họa Tiết Cho Chó Mèo',NULL,60000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7773653893377.jpg'),(36,'Set Dây Dắt Kèm Vòng Yếm Vải In Họa Tiết Cho Chó Mèo',NULL,55000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7679140462849.jpg'),(37,'Bát Ăn Cho Chó Mèo Inox Đế Cao Su Chống Trượt Đủ Size',NULL,40000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7691515429121.jpg'),(38,'Bình Bú Sữa PETAG Chó Mèo Con (Chuẩn USA)',NULL,65000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7766388998401.jpg'),(39,'Bình Nước Cho Chó Mèo Gắn Chuồng Tự Động',NULL,65000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7773643702529.jpg'),(40,'Tông Đơ Cắt Tỉa Lông Chó Mèo Sạc Điện CODOS CP-6800',NULL,600000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7736267604225.jpg'),(41,'Xẻng Xúc Cát Mèo Hình Mặt Mèo',NULL,15000.00,100,3,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8153035047169.jpg'),(42,'Túi Nilon Hốt Phân Cho Chó Mèo',NULL,5000.00,100,3,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7807742902529.jpg'),(43,'Vòi Nước Treo Chuồng Cao Cấp Doggyman Cho Chó Mèo',NULL,95000.00,100,3,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7766886678785.jpg'),(44,'Lược Chải Ve Rận Cho Chó Mèo',NULL,35000.00,100,3,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8095647826177.jpg'),(45,'Khay Vệ Sinh Cho Mèo Đa Năng Pakeway 50x40x20cm',NULL,230000.00,100,3,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8044147245313.jpg'),(46,'Nhà Cây Mèo Cat Tree Trụ Cao Vòm 2 Tầng',NULL,260000.00,100,4,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7918673133825.jpg'),(47,'Nhà Nệm Cho Mèo ZEZE Hình Con Gà',NULL,630000.00,100,4,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8199625277697.jpg'),(48,'Lồng Tắm & Sấy Chuyên Dụng Cho Chó Mèo <7kg',NULL,350000.00,100,4,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7765446787329.jpg'),(49,'Dây Dắt Yếm Police Nhỏ Dày 2cm Cho Chó <25kg',NULL,95000.00,100,5,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7773651566849.jpg'),(50,'Dây Dắt Chó Mèo Hộp Bấm Tự Động DoggyMan (Dài 5 mét)',NULL,205000.00,100,5,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7842584363265.jpg'),(51,'Dây Dắt Yếm Police Lớn Dày 3cm Cho Chó <35kg',NULL,140000.00,100,5,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7773651108097.jpg'),(52,'Dây Dắt Chó Mèo Hình Thú Bông 1cm x 120cm',NULL,70000.00,100,5,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8038612697345.jpg'),(53,'Bát Ăn Cho Chó Mèo Bằng Nhựa Nhiều Kiểu Dáng',NULL,75000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8817760731393.jpg'),(54,'Tông Đơ Cho Chó Mèo Diamond - 4in1 Cắt Tỉa Lông + Mài móng (Sạc Điện)',NULL,300000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8167966015745.jpg'),(55,'Bát Ăn Cho Chó Mèo Bằng Sứ Pawise',NULL,230000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8005805703425.jpg'),(56,'Bát Ăn Cho Chó Mèo Bằng Inox Chân Gỗ Cao Chống Gù',NULL,50000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8042509435137.jpg'),(57,'Máy Sấy Lông Cầm Tay Cho Chó Mèo Diamond 3in1',NULL,290000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8503427236097.jpg'),(58,'Máy Lọc Uống Nước Tự Động Pakeway Cho Chó Mèo (2.5L)',NULL,450000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7701702672641.jpg'),(59,'Bát Ăn Cho Chó Mèo Chống Gù Hình Tai Mèo Pet Cute','',70000.00,40,2,'both','2026-05-06 02:48:47','2026-05-07 14:26:10','active','uploads/paddy-8043753275649.jpg'),(60,'Kềm Cắt Móng Cho Chó Mèo Đèn Led PetQ',NULL,110000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8498511282433.jpg'),(61,'Bàn Chải Tắm Cho Chó Mèo DoggyMan Hỗ Trợ Massage',NULL,100000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8223964954881.jpg'),(62,'Nước Hoa Diamond Cho Chó Mèo Lưu Hương 12h',NULL,40000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8122514014465.jpg'),(63,'Nón Len Cho Chó Mèo Nhiều Mẫu Dễ Thương',NULL,80000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8076613681409.jpg'),(64,'Ống Bơm Sữa/Thức Ăn Cho Chó Mèo',NULL,30000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7766409969921.jpg'),(65,'Bát Ăn Uống Tự Động Cho Chó Mèo Nadir, Zenith 3L',NULL,360000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7965032710401.jpg'),(66,'Balo Phi Hành Gia Vuông Lớn Vận Chuyển Chó Mèo (Dưới 12kg)',NULL,480000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7601751884033.jpg'),(67,'Xương Gặm Cho Chó PeCow Bằng Gỗ Cafe',NULL,30000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8637107110145.jpg'),(68,'Lược Chải Lông Phun Sương Cho Chó Mèo PetQ',NULL,55000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8498471403777.jpg'),(69,'Bát Ăn Đơn Cho Chó Mèo BOBO',NULL,50000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8137646211329.jpg'),(70,'Bát Ăn Gấp Gọn Cho Chó Mèo FOFOS 500ml',NULL,75000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8014475952385.jpg'),(71,'Bát Ăn Cho Chó Mèo Bằng Nhựa Hình Mèo May Mắn',NULL,55000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8005809766657.jpg'),(72,'Bát Ăn Cho Chó Mèo Inox Đế Cao Có Thể Tháo Rời',NULL,70000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7933499212033.jpg'),(73,'Bình Uống Nước Cho Chó Mèo Tpet Tiện Lợi Mang Đi Dạo',NULL,70000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-7768716509441.jpg'),(74,'Thảm Liếm Thức Ăn Cho Chó Mèo Hỗ Trợ Ăn Chậm FOFOS 21cm','',120000.00,100,2,'both','2026-05-06 02:48:47','2026-05-10 11:08:40','active','uploads/paddy-8040169472257.jpg'),(75,'Máy Ăn Tự Động Petkit MINI 2.85L - Bát đựng inox (BH 12T)','',2500000.00,100,2,'both','2026-05-06 02:48:47','2026-05-10 11:06:13','active','uploads/paddy-7950268727553.jpg'),(76,'Bình Nước Đi Dạo Cho Chó Mèo Cao Cấp Có Nút Bấm 350ml','',130000.00,100,2,'both','2026-05-06 02:48:47','2026-05-10 11:06:00','active','uploads/paddy-7788948586753.jpg'),(77,'Bát Ăn Đôi Cho Chó Mèo Hình Cá','',100000.00,100,2,'both','2026-05-06 02:48:47','2026-05-10 11:04:24','active','uploads/paddy-7788947505409.jpg'),(78,'Bàn Ăn Chống Gù DoggyMan Bằng Nhựa Cho Chó','',270000.00,100,2,'both','2026-05-06 02:48:47','2026-05-10 11:04:54','active','uploads/paddy-7783560642817.jpg'),(79,'Máy Massage Tự Động Cho Mèo',NULL,310000.00,100,2,'both','2026-05-06 02:48:47','2026-05-07 06:09:40','active','uploads/paddy-8042775511297.jpg'),(80,'Máy Cắt Tỉa, Hút Lông & Chải Lông Cho Chó Mèo PetQ G2 5in1','',2450000.00,100,2,'both','2026-05-06 02:48:47','2026-05-08 05:05:20','active','uploads/paddy-8035220553985.jpg'),(81,'đồ đẹp','halo',12311.00,111,1,'both','2026-05-08 05:10:24','2026-05-08 05:10:24','active','uploads/1778217022003-vot-cau-long-vnb-v200-xanh-2.webp'),(82,'Chương Nguyên','halo',12311.00,80,3,'both','2026-05-08 05:14:46','2026-05-08 15:15:44','active','uploads/1778217284341-hellworld.jpg'),(83,'Chương Nguyên','Cát hút ẩm khử mùi hiệu quả',12311.00,111,5,'dog','2026-05-08 05:19:26','2026-05-10 12:02:29','active','uploads/1778217573606-ao-cau-long-yonex-ac68-nam-xanh-1.webp');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
INSERT INTO `refresh_tokens` VALUES (41,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTg5MDM4NSwiZXhwIjoxNzc2NDk1MTg1fQ.1Iq9KJE57Ybq8YcpXWTIUYd0ddPs6qmjXEO0l_5GP30','2026-04-18 13:53:05','2026-04-11 06:53:06'),(42,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTg5MTEyMywiZXhwIjoxNzc2NDk1OTIzfQ.rQ4ThBbquRt6XjkaDIu_jKgcYuIhOVPuRYS2SBMcvuc','2026-04-18 14:05:24','2026-04-11 07:05:25'),(43,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTkyNDM3MywiZXhwIjoxNzc2NTI5MTczfQ.GpDBXGyowQ_jLv_GCcEmQ3Spt6EXHiPJb-etWtNF2OI','2026-04-18 23:19:33','2026-04-11 16:19:33'),(47,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTk2NTU0MiwiZXhwIjoxNzc2NTcwMzQyfQ.w3V79uy8sncGJjCCTt9V39hd3Y2NAsscr_DIeV1QAbo','2026-04-19 10:45:43','2026-04-12 03:45:42'),(49,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTk3NTI3OSwiZXhwIjoxNzc2NTgwMDc5fQ.rBvm_gdL9VgoKv_X6yqX67O2efJ8qODviyupFmF8OBA','2026-04-19 13:28:00','2026-04-12 06:27:59'),(51,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTk3OTcxMiwiZXhwIjoxNzc2NTg0NTEyfQ.t13MryxsnFQF6cPJT7xcCV5h8mOXu7__Eg9dOVQ-pyA','2026-04-19 14:41:53','2026-04-12 07:41:52'),(53,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTk4NDUyOCwiZXhwIjoxNzc2NTg5MzI4fQ.S9lt8GBvpJ0uSHSIuusuqwwIaOiUTYXCTGonbSf0iyQ','2026-04-19 16:02:09','2026-04-12 09:02:08'),(54,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NTk4NTcyMCwiZXhwIjoxNzc2NTkwNTIwfQ.o5TAPKFccxWaK5uOG2iFCjE5-QrOTalK7JU22w6Xxxs','2026-04-19 16:22:00','2026-04-12 09:22:00'),(56,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjI2MTg2MiwiZXhwIjoxNzc2ODY2NjYyfQ.YOqxH-KLdmbzCoZs6sGzRs1Kphm2IaFjNxxSdEYUKYo','2026-04-22 21:04:22','2026-04-15 14:04:22'),(58,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjM0ODc5NywiZXhwIjoxNzc2OTUzNTk3fQ.iaaLbKzYc1wwvJBTXan3OHXSnFqv7c0JcNeoTanM024','2026-04-23 21:13:18','2026-04-16 14:13:20'),(60,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjQxOTQzMCwiZXhwIjoxNzc3MDI0MjMwfQ.wsH77-RIt4FmqvMpfJOwuHQNJRQNMfWQIW2_2CdBuTs','2026-04-24 16:50:31','2026-04-17 09:50:35'),(62,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjQzNTYyOSwiZXhwIjoxNzc3MDQwNDI5fQ.My1_-3dDD313lUyXvN7KcSr7gKuJh3LiOWcXs7uWpOE','2026-04-24 21:20:29','2026-04-17 14:20:31'),(64,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjQzOTA3OCwiZXhwIjoxNzc3MDQzODc4fQ.w0tawA90elygrlbztk-7ycsf6JNWgLmnIvVpqNTZuw0','2026-04-24 22:17:59','2026-04-17 15:18:02'),(66,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NjU5MDkzOSwiZXhwIjoxNzc3MTk1NzM5fQ.7UWEUFq0yf6HB3fKZ-Vq4Kb6XJjzHdFwM77WbTLeoEo','2026-04-26 16:28:59','2026-04-19 09:28:59'),(67,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NzE5MDEyNCwiZXhwIjoxNzc3Nzk0OTI0fQ.mOkK_DDv_0B5weK1_6e95OM6igVry1Y_oaofZP63BHc','2026-05-03 14:55:25','2026-04-26 07:55:25'),(71,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NzI3NTU0OSwiZXhwIjoxNzc3ODgwMzQ5fQ.Oxq4_VeAExqFWhiRdfsJMVhQ0mi5P-frDW8VXjXLboo','2026-05-04 14:39:09','2026-04-27 07:39:11'),(72,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3NzI3NTU0OSwiZXhwIjoxNzc3ODgwMzQ5fQ.Oxq4_VeAExqFWhiRdfsJMVhQ0mi5P-frDW8VXjXLboo','2026-05-04 14:39:09','2026-04-27 07:39:11'),(96,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3ODA3ODQzNywiZXhwIjoxNzc4NjgzMjM3fQ.zvXd7dLq1cCmaMHVn32zvuQ96URbJDe3CXSIuUlLq78','2026-05-13 21:40:37','2026-05-06 14:40:38'),(98,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3ODA3ODkwMywiZXhwIjoxNzc4NjgzNzAzfQ.siMImXkkYoJu2ra7Eup9zX5kEFtX56HY2-kYYkmMbBo','2026-05-13 21:48:23','2026-05-06 14:48:22'),(102,6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJhZG1pbjAxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3ODE2MzA1MywiZXhwIjoxNzc4NzY3ODUzfQ.hhUVanPK3Gq7V-c3FL2czGc4h-nu0Mr1TD_dd6sZ_7k','2026-05-14 21:10:54','2026-05-07 14:10:55');
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text,
  `status` tinyint DEFAULT '1' COMMENT '1: hiển thị, 0: ẩn/chờ duyệt',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_reviews_user` (`user_id`),
  KEY `fk_reviews_product` (`product_id`),
  CONSTRAINT `fk_reviews_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reviews_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,6,20,5,'Sản phẩm rất tốt, đáng mua! địt',1,'2026-05-02 06:50:36'),(2,6,20,3,'quá đẹp',1,'2026-05-02 08:23:27'),(4,6,20,5,'đẹp',1,'2026-05-02 12:58:54'),(5,6,20,5,'hay',1,'2026-05-02 12:58:58'),(6,6,20,5,'đẹp nha',1,'2026-05-02 12:59:05');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale`
--

DROP TABLE IF EXISTS `sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sale` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `percent` decimal(5,2) NOT NULL,
  `expired_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('active','inactive') DEFAULT 'active',
  PRIMARY KEY (`id`),
  KEY `fk_product_sale` (`product_id`),
  CONSTRAINT `fk_product_sale` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale`
--

LOCK TABLES `sale` WRITE;
/*!40000 ALTER TABLE `sale` DISABLE KEYS */;
INSERT INTO `sale` VALUES (1,83,11.00,'2026-05-10 12:19:00','2026-05-08 05:19:26','inactive'),(2,82,11.00,'2026-05-11 12:19:00','2026-05-08 05:19:50','active'),(3,83,15.00,'2026-05-10 12:23:00','2026-05-08 05:23:18','inactive'),(4,77,15.00,'2026-05-16 18:04:00','2026-05-10 11:04:24','active'),(5,78,26.00,'2026-05-11 18:04:00','2026-05-10 11:04:54','active'),(6,76,11.00,'2026-05-12 18:05:00','2026-05-10 11:06:00','active'),(7,75,11.00,'2026-05-12 18:06:00','2026-05-10 11:06:13','active'),(8,74,22.00,'2026-05-15 18:08:00','2026-05-10 11:08:41','active'),(9,77,15.00,NULL,'2026-05-10 11:52:21','active');
/*!40000 ALTER TABLE `sale` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `role` enum('admin','user') DEFAULT 'user',
  `status` enum('active','banned') DEFAULT 'active',
  `is_deleted` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar` varchar(255) DEFAULT 'default-avatar.png',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'chuongvippro123','123@gmail.com','$2b$10$2Q4ttK5xTFWRPWXvZAacj.i7X3F8IQg6Zajt9zNUNerxip/GJ.sOi',NULL,NULL,'user','active',0,NULL,'default-avatar.png'),(3,'chuongvippro123','12345@gmail.com','$2b$10$e4w7PvsMn5I/p9hGHvu2VOTuOqsw2RvpC.kcSzSZvqAIUrLO1X1hO','0383385580','123 abc','user','active',0,NULL,'default-avatar.png'),(4,'chuongvippro123','12345777@gmail.com','$2b$10$KcjeeAHaEKFdbc9pKVePnux1cb6sqfXjg5Dd1IGTKwDRyTceniy6q','',NULL,'user','active',0,NULL,'default-avatar.png'),(6,'ADMIN','admin01@gmail.com','$2b$10$/X.brHJB4JCTXBVYiqCWa.qTQ6nPdsLnjfAMCXidknRh0.DumaYve',NULL,NULL,'admin','active',0,NULL,'default-avatar.png'),(8,'DH52200412','DH52200412@student.stu.edu.vn','$2b$10$cnUhvR2IMgeqnXsZvtubM.52ZTgi9cL1NGiBObPMmEPQZhGRL.4hu',NULL,NULL,'user','active',0,NULL,'default-avatar.png');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


ALTER TABLE products MODIFY COLUMN pet_type ENUM('dog', 'cat', 'both', 'rabbit', 'hamster', 'other');
ALTER TABLE users 
MODIFY COLUMN role ENUM('admin', 'staff', 'user') DEFAULT 'user';
--
-- Dumping routines for database 'petshop'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-10 19:02:55
