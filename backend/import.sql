CREATE DATABASE  IF NOT EXISTS `cocktail_db` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `cocktail_db`;

-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: cocktail_db
-- ------------------------------------------------------
-- Server version	5.7.16-log

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
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
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
-- Temporary view structure for view `cocktail liste`
--

DROP TABLE IF EXISTS `cocktail liste`;
/*!50001 DROP VIEW IF EXISTS `cocktail liste`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `cocktail liste` AS SELECT 
 1 AS `Cocktail`,
 1 AS `Zutat`,
 1 AS `Menge`,
 1 AS `Inventarmenge`,
 1 AS `Einheit`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `machbare_cocktails`
--

DROP TABLE IF EXISTS `machbare_cocktails`;
/*!50001 DROP VIEW IF EXISTS `machbare_cocktails`*/;
SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE VIEW `machbare_cocktails` AS SELECT 
 1 AS `Cocktail`,
 1 AS `Anzahl`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `rezept`
--

DROP TABLE IF EXISTS `rezept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rezept` (
  `Cocktail_ID` int(11) NOT NULL,
  `Zutat_ID` int(11) NOT NULL,
  `Menge` smallint(6) NOT NULL,
  PRIMARY KEY (`Cocktail_ID`,`Zutat_ID`),
  KEY `fk_Rezepte_Cocktail1_idx` (`Cocktail_ID`),
  CONSTRAINT `fk_Rezepte_Cocktail1` FOREIGN KEY (`Cocktail_ID`) REFERENCES `cocktail` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rezept`
--

LOCK TABLES `rezept` WRITE;
/*!40000 ALTER TABLE `rezept` DISABLE KEYS */;
INSERT INTO `rezept` VALUES (1,1,40),(1,2,460),(1,3,1),(2,1,30),(2,4,30),(2,5,30);
/*!40000 ALTER TABLE `rezept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zutat`
--

DROP TABLE IF EXISTS `zutat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `zutat` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Inventarmenge` smallint(6) NOT NULL,
  `Einheit` varchar(10) NOT NULL COMMENT 'zB.: ml, cl, Scheiben oder Stück',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zutat`
--

LOCK TABLES `zutat` WRITE;
/*!40000 ALTER TABLE `zutat` DISABLE KEYS */;
INSERT INTO `zutat` VALUES (1,'Gin',400,'ml'),(2,'Tonic Water',1000,'ml'),(3,'Zitrone',10,'Scheibe'),(4,'Campari',0,'ml'),(5,'Roter Wermut',0,'ml');
/*!40000 ALTER TABLE `zutat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'cocktail_db'
--

--
-- Dumping routines for database 'cocktail_db'
--

--
-- Final view structure for view `cocktail liste`
--

/*!50001 DROP VIEW IF EXISTS `cocktail liste`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `cocktail liste` AS select `c`.`Name` AS `Cocktail`,`z`.`Name` AS `Zutat`,`r`.`Menge` AS `Menge`,`z`.`Inventarmenge` AS `Inventarmenge`,`z`.`Einheit` AS `Einheit` from ((`rezept` `r` join `cocktail` `c` on((`r`.`Cocktail_ID` = `c`.`ID`))) join `zutat` `z` on((`r`.`Zutat_ID` = `z`.`ID`))) order by `c`.`Name` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `machbare_cocktails`
--

/*!50001 DROP VIEW IF EXISTS `machbare_cocktails`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `machbare_cocktails` AS select `c`.`Name` AS `Cocktail`,floor(min((`z`.`Inventarmenge` / `r`.`Menge`))) AS `Anzahl` from ((`rezept` `r` join `cocktail` `c` on((`c`.`ID` = `r`.`Cocktail_ID`))) join `zutat` `z` on((`z`.`ID` = `r`.`Zutat_ID`))) group by `c`.`ID` */;
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

-- Dump completed on 2017-11-28  9:19:51
