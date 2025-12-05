-- MySQL dump 10.13  Distrib 8.0.44, for Linux (x86_64)
--
-- Host: zentrodb.ct4uca6ug9v9.us-east-1.rds.amazonaws.com    Database: zentro
-- ------------------------------------------------------
-- Server version	8.0.43

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '';

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `autor` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` date NOT NULL,
  `imagen` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contenido` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (1,'Llegó la nueva edición de FRANKY de One Piece','ZENTRO','2025-09-23','/img/frank.webp','La llegada de esta nueva edición tiene emocionados a los fanáticos de One Piece. Esta pieza de edición limitada incluye a Chopper y accesorios exclusivos de Bandai.','2025-11-26 17:01:13'),(2,'¡Atención! Tenemos nuevo stock de MALENIA','ZENTRO','2025-10-01','/img/malenia.webp','Renovamos stock de Malenia tras su éxito total. Esta figura basada en Elden Ring es una de las más solicitadas del año.','2025-11-26 17:01:13'),(3,'test','zentro','2025-11-26','/img/1764178036664-221748244.jpg','tests','2025-11-26 17:27:17');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carrito_items`
--

DROP TABLE IF EXISTS `carrito_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `un_usuario_producto` (`id_usuario`,`id_producto`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `carrito_items_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `carrito_items_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito_items`
--

LOCK TABLES `carrito_items` WRITE;
/*!40000 ALTER TABLE `carrito_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactos`
--

DROP TABLE IF EXISTS `contactos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `comentario` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactos`
--

LOCK TABLES `contactos` WRITE;
/*!40000 ALTER TABLE `contactos` DISABLE KEYS */;
/*!40000 ALTER TABLE `contactos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio` decimal(10,0) NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `stock` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `imagenes` json NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (8,'One Piece RORONOA ZORO THREE SWORDS set (Wado Ichimonji, Sandai Kitetsu, Enma) 1/1 PROPLICA',679990,'Personaje: THREE SWORDS set. Fabricante: Bandai – Tamashii Nations. Línea: PROPLICA. Tamaño: 95 cm de largo.',9,'2025-11-26 11:43:38','[\"/img/roronoa2.webp\", \"/img/roronoa3.webp\", \"/img/roronoa.webp\"]'),(9,'One Piece Soul of Chogokin General Franky GX-63 Bandai',820000,'Incluye cuerpo Shogun, espada Franky, piezas de black rhinoceros, cabina Burakiotanku, y soporte para exposición.',5,'2025-11-26 11:43:38','[\"/img/frank.webp\", \"/img/frank2.webp\", \"/img/frank3.webp\"]'),(10,'T-51 Nuka Cola Power Armor THREE ZERO',350000,'Figura articulada T-51 Nuka Cola Power Armor de Fallout. Fabricante: Three Zero. Tamaño: 30 cm de alto.',3,'2025-11-26 11:43:38','[\"/img/nuka.webp\", \"/img/nuka2.webp\", \"/img/nuka3.webp\"]'),(11,'Malenia Blade of Miquella — Figura de acción 1/6 escala',450000,'Figura articulada con accesorios y armadura detallada basada en Elden Ring.',4,'2025-11-26 11:43:38','[\"/img/malenia.webp\", \"/img/malenia2.webp\", \"/img/malenia3.webp\"]'),(12,'Figura Coleccionable Rubia Deluxe',200000,'Figura de colección de mujer rubia con detalles finos y base decorativa.',1,'2025-11-26 11:43:38','[\"/img/aa3-3.jpg\", \"/img/aa2-3.jpg\", \"/img/aa4-3.jpg\"]'),(13,'Fullmetal Alchemist: Edward y Alphonse',180000,'Diorama con los hermanos Elric de Fullmetal Alchemist: Brotherhood. Alta calidad de pintura.',8,'2025-11-26 11:43:38','[\"/img/fmab.webp\", \"/img/fmab2.webp\", \"/img/fmab3.webp\"]'),(14,'Vestido estilo gótico con encaje',18000,'Vestido gótico elegante con detalles de encaje, ideal para cosplay o coleccionismo.',5,'2025-11-26 11:43:38','[\"/img/cariñosa1.webp\", \"/img/cariñosa2.webp\", \"/img/cariñosa3.webp\"]'),(15,'Set de Katanas de Colección',50000,'Réplicas metálicas inspiradas en katanas de animes populares. Edición decorativa.',29,'2025-11-26 11:43:38','[\"/img/espada.png\", \"/img/espada2.png\", \"/img/espada3.png\"]'),(19,'Macchiato: Ballroom Interlude Ver. 1/7',319990,'una de las primeras unidades y el mejor precio posible.\nSerie\nGirls’ Frontline 2: Exilium\nFabricante\nWonderful Works\nFecha de salida\nAgosto/Sept 2026\nTamaño\n25 cms (escala 1/7)',7,'2025-11-26 22:05:36','[\"/img/1764194718461-565432004.jpg\", \"/img/1764194721316-381032383.jpg\", \"/img/1764194724159-386020968.jpg\", \"/img/1764194729037-571322866.jpg\", \"/img/1764194732438-999668009.jpg\", \"/img/1764194734630-168042931.jpg\"]');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` enum('Admin','Cliente') COLLATE utf8mb4_unicode_ci DEFAULT 'Cliente',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador','admin@gmail.com','$2b$10$bte4cmTCPBvGdQTjRJDnfunNwskH9KK.BIuJj67iBaqrpfTGHqTi2','Admin','2025-11-25 22:04:40'),(2,'Cliente de prueba','cliente@gmail.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','Cliente','2025-11-25 22:04:40'),(3,'JOSÉ NICOLÁS','tapianikito01@gmail.com','$2b$10$bte4cmTCPBvGdQTjRJDnfunNwskH9KK.BIuJj67iBaqrpfTGHqTi2','Cliente','2025-11-25 22:14:36'),(5,'jose','tapia@gmail.com','$2b$10$NkB3NUIIu/ZO9bKhoWwaNOkCWwZOvRKGLUItQeKKZhVU8qo5i4DX2','Admin','2025-11-26 16:44:04'),(6,'Ako','ako@gmail.com','$2b$10$kZvLOCp7NbXn0OEsAyeu3.xsFe50n33GtDUfJa8Go5lL2wGq4NtV6','Admin','2025-11-26 21:58:35'),(7,'Tapia ','tapiatapia065@gmail.com','$2b$10$afj7dXZqFwOENTGmVowHZuCgk1WRGPws9N4QkWr3EDOwAYbGROY0m','Cliente','2025-11-26 22:29:23');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas`
--

DROP TABLE IF EXISTS `ventas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `total` decimal(10,0) NOT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `token_orden` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre_cliente` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `correo_cliente` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_usuario` (`id_usuario`),
  CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas`
--

LOCK TABLES `ventas` WRITE;
/*!40000 ALTER TABLE `ventas` DISABLE KEYS */;
INSERT INTO `ventas` VALUES (1,6,1550000,'2025-11-26 22:00:28','',NULL,NULL);
/*!40000 ALTER TABLE `ventas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ventas_detalle`
--

DROP TABLE IF EXISTS `ventas_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ventas_detalle` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_venta` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `subtotal` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_venta` (`id_venta`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `ventas_detalle_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ventas_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ventas_detalle`
--

LOCK TABLES `ventas_detalle` WRITE;
/*!40000 ALTER TABLE `ventas_detalle` DISABLE KEYS */;
INSERT INTO `ventas_detalle` VALUES (1,1,15,3,150000),(2,1,10,4,1400000);
/*!40000 ALTER TABLE `ventas_detalle` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-27 17:55:49
