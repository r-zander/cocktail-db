DROP Database `cocktail_db`;

CREATE DATABASE  IF NOT EXISTS `cocktail_db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `cocktail_db`;
-- MySQL dump 10.13  Distrib 5.7.17, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: cocktail_db
-- ------------------------------------------------------
-- Server version	5.7.20-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cocktail`
--

DROP TABLE IF EXISTS `cocktail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cocktail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cocktail`
--

LOCK TABLES `cocktail` WRITE;
/*!40000 ALTER TABLE `cocktail` DISABLE KEYS */;
INSERT INTO `cocktail` VALUES (1,'Gin Tonic'),(2,'Negroni'),(3,'VAC');
/*!40000 ALTER TABLE `cocktail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `cocktail_list`
--

DROP TABLE IF EXISTS `cocktail_list`;
/*!50001 DROP VIEW IF EXISTS `cocktail_list`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `cocktail_list` AS SELECT 
 1 AS `cocktail`,
 1 AS `ingredient`,
 1 AS `amount`,
 1 AS `stock_amount`,
 1 AS `unit`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `ingredient`
--

DROP TABLE IF EXISTS `ingredient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ingredient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `stock_amount` smallint(6) NOT NULL,
  `unit` varchar(10) NOT NULL COMMENT 'zB.: ml, cl, Scheiben oder Stück',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredient`
--

LOCK TABLES `ingredient` WRITE;
/*!40000 ALTER TABLE `ingredient` DISABLE KEYS */;
INSERT INTO `ingredient` VALUES (1,'Gin',400,'ml'),(2,'Tonic Water',1300,'ml'),(3,'Zitrone',10,'Scheibe'),(4,'Campari',0,'ml'),(5,'Roter Wermut',0,'ml'),(6,'Pineapple Juice',100,'ml'),(7,'Coca Cola',1000,'ml'),(8,'Skyy Vodka',700,'ml');
/*!40000 ALTER TABLE `ingredient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `mixable_drinks`
--

DROP TABLE IF EXISTS `mixable_drinks`;
/*!50001 DROP VIEW IF EXISTS `mixable_drinks`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `mixable_drinks` AS SELECT 
 1 AS `cocktail`,
 1 AS `count`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `recipe`
--

DROP TABLE IF EXISTS `recipe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `recipe` (
  `cocktail_id` int(11) NOT NULL,
  `ingredient_id` int(11) NOT NULL,
  `amount` smallint(6) NOT NULL,
  PRIMARY KEY (`cocktail_id`,`ingredient_id`),
  KEY `fk_Rezepte_Cocktail1_idx` (`cocktail_id`),
  KEY `fk_Rezepte_Zutat1_idx` (`ingredient_id`),
  CONSTRAINT `fk_Rezepte_Cocktail1` FOREIGN KEY (`cocktail_id`) REFERENCES `cocktail` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_Rezepte_Zutat1` FOREIGN KEY (`ingredient_id`) REFERENCES `ingredient` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe`
--

LOCK TABLES `recipe` WRITE;
/*!40000 ALTER TABLE `recipe` DISABLE KEYS */;
INSERT INTO `recipe` VALUES (1,1,40),(1,2,460),(1,3,1),(2,1,30),(2,4,30),(2,5,30),(3,6,210),(3,7,40),(3,8,50);
/*!40000 ALTER TABLE `recipe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `cocktail_list`
--

/*!50001 DROP VIEW IF EXISTS `cocktail_list`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `cocktail_list` AS select `c`.`name` AS `cocktail`,`i`.`name` AS `ingredient`,`r`.`amount` AS `amount`,`i`.`stock_amount` AS `stock_amount`,`i`.`unit` AS `unit` from ((`recipe` `r` join `cocktail` `c` on((`r`.`cocktail_id` = `c`.`id`))) join `ingredient` `i` on((`r`.`ingredient_id` = `i`.`id`))) order by `c`.`name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `mixable_drinks`
--

/*!50001 DROP VIEW IF EXISTS `mixable_drinks`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `mixable_drinks` AS select `c`.`name` AS `cocktail`,floor(min((`i`.`stock_amount` / `r`.`amount`))) AS `count` from ((`recipe` `r` join `cocktail` `c` on((`c`.`id` = `r`.`cocktail_id`))) join `ingredient` `i` on((`i`.`id` = `r`.`ingredient_id`))) group by `c`.`id` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-02 15:29:37
