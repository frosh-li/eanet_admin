-- MySQL dump 10.13  Distrib 5.6.17, for osx10.7 (x86_64)
--
-- Host: 10.1.169.32    Database: admin_framework
-- ------------------------------------------------------
-- Server version	5.5.32-log

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
-- Table structure for table `auth`
--

DROP TABLE IF EXISTS `auth`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth` (
  `aid` int(11) NOT NULL AUTO_INCREMENT,
  `from_status` int(11) NOT NULL DEFAULT '0',
  `to_status` int(11) NOT NULL DEFAULT '0',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`aid`),
  UNIQUE KEY `unique_from_to` (`from_status`,`to_status`),
  KEY `auth_from_status_idx` (`from_status`),
  KEY `auth_to_status_idx` (`to_status`),
  CONSTRAINT `auth_from_status` FOREIGN KEY (`from_status`) REFERENCES `enum_const` (`ecid`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `auth_to_status` FOREIGN KEY (`to_status`) REFERENCES `enum_const` (`ecid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=200 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth`
--

LOCK TABLES `auth` WRITE;
/*!40000 ALTER TABLE `auth` DISABLE KEYS */;
INSERT INTO `auth` VALUES (192,1001,1002,'2014-07-21 06:24:30'),(193,1002,1003,'2014-07-21 06:25:51'),(194,1001,1003,'2014-07-21 06:26:04'),(195,1003,1002,'2014-07-21 06:26:19'),(196,1101,1102,'2014-07-21 06:26:42'),(197,1101,1103,'2014-07-21 06:27:44'),(198,1102,1103,'2014-07-21 06:28:00'),(199,1103,1102,'2014-07-21 06:28:19');
/*!40000 ALTER TABLE `auth` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group` (
  `agid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(20) NOT NULL COMMENT '权限组名称',
  `description` varchar(100) NOT NULL COMMENT '权限组描述',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`agid`),
  UNIQUE KEY `unique_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
INSERT INTO `auth_group` VALUES (1,'超级管理员权限组','仅供系统管理','2014-06-02 15:23:42'),(99,'测试权限组','仅供测试','2014-07-18 06:50:59');
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_node`
--

DROP TABLE IF EXISTS `auth_group_node`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_group_node` (
  `agnid` int(11) NOT NULL AUTO_INCREMENT,
  `agid` int(11) NOT NULL,
  `nodeid` smallint(5) unsigned NOT NULL,
  PRIMARY KEY (`agnid`),
  UNIQUE KEY `agid_nodeid_unique` (`agid`,`nodeid`),
  KEY `agdi_idx` (`agid`),
  KEY `auth_group_node_nid_idx` (`nodeid`),
  CONSTRAINT `auth_group_node_agid` FOREIGN KEY (`agid`) REFERENCES `auth_group` (`agid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `auth_group_node_nodeid` FOREIGN KEY (`nodeid`) REFERENCES `node` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=115 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_node`
--

LOCK TABLES `auth_group_node` WRITE;
/*!40000 ALTER TABLE `auth_group_node` DISABLE KEYS */;
INSERT INTO `auth_group_node` VALUES (86,1,84),(90,1,110),(91,1,112),(92,1,113),(93,1,197),(94,1,198),(88,1,257),(89,1,268);
/*!40000 ALTER TABLE `auth_group_node` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_set`
--

DROP TABLE IF EXISTS `auth_set`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_set` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `agid` int(11) NOT NULL COMMENT '权限组ID',
  `aid` int(11) NOT NULL COMMENT '权限ID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_agid_aid` (`agid`,`aid`),
  KEY `auth_set_agid_idx` (`agid`),
  KEY `auth_set_aid_idx` (`aid`),
  CONSTRAINT `auth_set_agid` FOREIGN KEY (`agid`) REFERENCES `auth_group` (`agid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `auth_set_aid` FOREIGN KEY (`aid`) REFERENCES `auth` (`aid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=258 DEFAULT CHARSET=utf8 COMMENT='权限与组关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_set`
--

LOCK TABLES `auth_set` WRITE;
/*!40000 ALTER TABLE `auth_set` DISABLE KEYS */;
INSERT INTO `auth_set` VALUES (243,1,192),(256,1,193),(253,1,194),(244,1,195),(247,1,196),(249,1,197),(250,1,198),(248,1,199);
/*!40000 ALTER TABLE `auth_set` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `enum_const`
--

DROP TABLE IF EXISTS `enum_const`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `enum_const` (
  `ecid` int(11) NOT NULL AUTO_INCREMENT,
  `ecvalue` varchar(100) NOT NULL DEFAULT '',
  `name_space` varchar(100) NOT NULL DEFAULT '',
  `is_del` tinyint(4) NOT NULL DEFAULT '0',
  `ecname` varchar(100) NOT NULL DEFAULT '',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ecid`),
  UNIQUE KEY `value_UNIQUE` (`ecvalue`),
  KEY `name_space` (`name_space`,`is_del`)
) ENGINE=InnoDB AUTO_INCREMENT=3314 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `enum_const`
--

LOCK TABLES `enum_const` WRITE;
/*!40000 ALTER TABLE `enum_const` DISABLE KEYS */;
INSERT INTO `enum_const` VALUES (0,'N/A','N/A',0,'N/A_无状态','2014-06-02 09:06:32'),(1001,'SUB_ADT_01','sample_subitem.audit_status',0,'SUB_ADT_01_待审核','2014-07-21 07:00:49'),(1002,'SUB_ADT_02','sample_subitem.audit_status',0,'SUB_ADT_02_审核通过','2014-07-21 07:01:58'),(1003,'SUB_ADT_03','sample_subitem.audit_status',0,'SUB_ADT_03_审核不通过','2014-07-21 07:02:23'),(1101,'SUB_PUB_01','sample_subitem.pub_status',0,'SUB_PUB_01_待发布','2014-07-21 07:03:04'),(1102,'SUB_PUB_02','sample_subitem.pub_status',0,'SUB_PUB_02_已发布','2014-07-21 07:03:31'),(1103,'SUB_PUB_03','sample_subitem.pub_status',0,'SUB_PUB_03_撤销发布','2014-07-21 07:04:02');
/*!40000 ALTER TABLE `enum_const` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `files` (
  `fid` int(11) NOT NULL AUTO_INCREMENT,
  `md5` varchar(32) NOT NULL DEFAULT '',
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT '源ID',
  `parent_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '源类型：1biz，2dbz',
  `is_del` tinyint(4) NOT NULL DEFAULT '0',
  `input_uid` int(11) NOT NULL DEFAULT '0',
  `filename` varchar(1000) NOT NULL DEFAULT '' COMMENT '文件名',
  `filesize` int(11) NOT NULL DEFAULT '0' COMMENT '文件大小（字节）',
  `data_space` tinyint(4) NOT NULL DEFAULT '0' COMMENT '存储位置：0默认，其他待开辟新空间后定义',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fid`),
  KEY `parent_id` (`parent_id`),
  KEY `md5` (`md5`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8 COMMENT='上传文件';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `node`
--

DROP TABLE IF EXISTS `node`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `node` (
  `id` smallint(6) unsigned NOT NULL AUTO_INCREMENT,
  `pid` smallint(6) unsigned NOT NULL DEFAULT '0',
  `name` varchar(50) DEFAULT NULL,
  `url` varchar(200) DEFAULT NULL,
  `is_del` tinyint(3) NOT NULL DEFAULT '0',
  `sort` int(11) NOT NULL DEFAULT '0',
  `icon` varchar(255) DEFAULT NULL,
  `sub_folder` varchar(20) DEFAULT NULL,
  `remark` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pid` (`pid`),
  KEY `status` (`is_del`)
) ENGINE=InnoDB AUTO_INCREMENT=277 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `node`
--

LOCK TABLES `node` WRITE;
/*!40000 ALTER TABLE `node` DISABLE KEYS */;
INSERT INTO `node` VALUES (84,0,'系统管理','',0,999,'icon-cogs','',''),(110,84,'用户管理','user/index',0,50,NULL,NULL,''),(112,84,'权限设置','auth/index',0,30,NULL,NULL,''),(113,84,'权限组管理','auth_group/index',0,40,NULL,NULL,''),(182,0,'欢迎页','home/index',0,1,'icon-file-alt','',''),(197,84,'系统日志','sys_log/index',0,60,NULL,NULL,NULL),(198,84,'系统信息','sys_info/index',0,70,NULL,NULL,NULL),(257,84,'业务状态设置','enum_const/index',0,20,NULL,NULL,NULL),(259,0,'示例一级菜单1',NULL,0,2,'icon-book',NULL,NULL),(260,0,'示例一级菜单2',NULL,0,3,'icon-book',NULL,NULL),(261,259,'示例子菜单1',NULL,0,1,NULL,NULL,NULL),(262,259,'示例子菜单2',NULL,0,2,NULL,NULL,NULL),(263,261,'A内容管理','sample_item/index',0,1,NULL,NULL,NULL),(264,262,'Sub内容管理','sample_subitem/index',0,2,NULL,NULL,NULL),(265,262,'Sub内容定制录入','sample_subitem/input',0,2,NULL,NULL,NULL),(266,262,'Sub内容待审核','sample_subitem/audit_status?t=SUB_ADT_01',0,3,NULL,NULL,NULL),(267,262,'Sub内容待发布','sample_subitem/pub_status?t=SUB_PUB_01',0,4,NULL,NULL,NULL),(268,84,'菜单管理','node/index',0,10,NULL,NULL,NULL);
/*!40000 ALTER TABLE `node` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_item`
--

DROP TABLE IF EXISTS `sample_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_item` (
  `itemid` int(11) NOT NULL AUTO_INCREMENT,
  `itemname` varchar(45) NOT NULL DEFAULT '',
  `field1` varchar(45) NOT NULL DEFAULT '',
  `field2` varchar(45) NOT NULL DEFAULT '',
  PRIMARY KEY (`itemid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='示例条目表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_item`
--

LOCK TABLES `sample_item` WRITE;
/*!40000 ALTER TABLE `sample_item` DISABLE KEYS */;
INSERT INTO `sample_item` VALUES (1,'aaa','f1','f2'),(2,'bbbbb','b_f1','b_f2'),(3,'啊啊啊啊','好了','没？');
/*!40000 ALTER TABLE `sample_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sample_subitem`
--

DROP TABLE IF EXISTS `sample_subitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sample_subitem` (
  `subid` int(11) NOT NULL AUTO_INCREMENT,
  `fk_itemid` varchar(45) NOT NULL DEFAULT '',
  `subname` varchar(45) NOT NULL DEFAULT '',
  `audit_status` int(11) NOT NULL DEFAULT '0',
  `pub_status` int(11) NOT NULL,
  `ctime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`subid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COMMENT='示例表2';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sample_subitem`
--

LOCK TABLES `sample_subitem` WRITE;
/*!40000 ALTER TABLE `sample_subitem` DISABLE KEYS */;
INSERT INTO `sample_subitem` VALUES (1,'1','Sub1啊',1003,0,'2014-07-21 06:44:02'),(2,'2','Sub2呵呵',1003,0,'2014-07-21 06:44:04'),(3,'3','cccc',1002,1101,'2014-07-21 06:44:10'),(4,'1','tst1',1002,1102,'2014-07-21 06:44:12'),(5,'','aaaaaaaaa',1003,1103,'2014-07-21 06:44:14');
/*!40000 ALTER TABLE `sample_subitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status_log`
--

DROP TABLE IF EXISTS `status_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `status_log` (
  `stlid` int(11) NOT NULL AUTO_INCREMENT,
  `object_id` int(11) NOT NULL DEFAULT '0' COMMENT '源ID',
  `object_field` varchar(20) NOT NULL DEFAULT '',
  `object_table` varchar(20) NOT NULL DEFAULT '',
  `status` int(11) NOT NULL DEFAULT '0',
  `op_uid` int(11) NOT NULL DEFAULT '0',
  `remark` varchar(1000) NOT NULL DEFAULT '',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`stlid`),
  KEY `parent_id` (`object_id`)
) ENGINE=InnoDB AUTO_INCREMENT=431 DEFAULT CHARSET=utf8 COMMENT='状态日志';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status_log`
--

LOCK TABLES `status_log` WRITE;
/*!40000 ALTER TABLE `status_log` DISABLE KEYS */;
INSERT INTO `status_log` VALUES (430,1,'audit_status','sample_subitem',1003,1,'','2014-09-04 05:47:00');
/*!40000 ALTER TABLE `status_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sys_log`
--

DROP TABLE IF EXISTS `sys_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sys_log` (
  `slid` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL DEFAULT '0',
  `user` varchar(100) NOT NULL DEFAULT '',
  `operation` varchar(100) NOT NULL DEFAULT '',
  `ext` text NOT NULL,
  `ip` varchar(15) NOT NULL DEFAULT '',
  `ctime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`slid`)
) ENGINE=InnoDB AUTO_INCREMENT=638 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sys_log`
--

LOCK TABLES `sys_log` WRITE;
/*!40000 ALTER TABLE `sys_log` DISABLE KEYS */;
INSERT INTO `sys_log` VALUES (445,1,'admin(超级管理员)','登录','','10.1.174.186','2014-07-18 07:44:21'),(446,1,'admin(超级管理员)','退出','','10.1.174.186','2014-07-18 07:45:00'),(447,1,'admin(超级管理员)','登录','','10.1.174.186','2014-07-18 07:57:35'),(448,1,'admin(超级管理员)','退出','','10.1.174.186','2014-07-18 07:57:47'),(449,1,'admin(超级管理员)','登录','','10.1.174.186','2014-07-18 07:57:55'),(450,1,'admin(超级管理员)','登录','','127.0.0.1','2014-07-21 02:18:38'),(451,1,'admin(超级管理员)','创建数据AuthGroup','{\"name\":\"\\u7ba1\\u7406\\u6743\\u9650\\u7ec4\",\"agid\":100}','127.0.0.1','2014-07-21 03:05:03'),(452,1,'admin(超级管理员)','修改数据User','{\"user\":\"admin\",\"name\":\"\\u8d85\\u7ea7\\u7ba1\\u7406\\u5458\",\"phone\":\"13810713402\",\"agid\":100,\"uid\":1}','127.0.0.1','2014-07-21 06:33:25'),(453,1,'admin(超级管理员)','删除数据AuthSet','{\"id\":\"232\"}','127.0.0.1','2014-07-21 07:15:54'),(454,1,'admin(超级管理员)','删除数据AuthSet','{\"id\":\"233\"}','127.0.0.1','2014-07-21 07:17:30'),(455,1,'admin(超级管理员)','退出','','127.0.0.1','2014-07-21 07:45:43'),(456,1,'admin(超级管理员)','登录','','127.0.0.1','2014-07-21 07:45:58'),(457,1,'admin(超级管理员)','退出','','127.0.0.1','2014-07-21 07:48:49'),(458,1,'admin(超级管理员)','登录','','127.0.0.1','2014-07-21 07:49:05'),(459,1,'admin(超级管理员)','退出','','127.0.0.1','2014-07-21 07:49:47'),(460,1,'admin(超级管理员)','登录','','127.0.0.1','2014-07-21 07:50:00'),(461,1,'admin(超级管理员)','退出','','127.0.0.1','2014-07-21 07:51:30'),(462,1,'admin(超级管理员)','登录','','127.0.0.1','2014-07-21 07:51:39'),(463,1,'admin(超级管理员)','创建数据AuthSet','{\"agid\":1,\"aid\":192,\"id\":243}','127.0.0.1','2014-07-21 07:52:15'),(464,1,'admin(超级管理员)','创建数据AuthSet','{\"agid\":1,\"aid\":195,\"id\":244}','127.0.0.1','2014-07-21 07:52:20'),(465,1,'admin(超级管理员)','创建数据AuthSet','{\"agid\":1,\"aid\":194,\"id\":245}','127.0.0.1','2014-07-21 07:52:25'),(466,1,'admin(超级管理员)','创建数据AuthSet','{\"agid\":1,\"aid\":193,\"id\":246}','127.0.0.1','2014-07-21 07:52:30'),(467,1,'admin(超级管理员)','创建数据AuthSet','{\"agid\":1,\"aid\":196,\"id\":247}','127.0.0.1','2014-07-21 07:52:35'),(468,1,'admin(超级管理员)','创建数据AuthSet','{\"agid\":1,\"aid\":199,\"id\":248}','127.0.0.1','2014-07-21 07:52:41'),(469,1,'admin(超级管理员)','创建数据AuthSet','{\"agid\":1,\"aid\":197,\"id\":249}','127.0.0.1','2014-07-21 07:52:45'),(470,1,'admin(超级管理员)','创建数据AuthSet','{\"agid\":1,\"aid\":198,\"id\":250}','127.0.0.1','2014-07-21 07:52:50'),(471,1,'admin(超级管理员)','修改数据AuthGroup','{\"name\":\"\\u5ba1\\u6838\\u6743\\u9650\\u7ec4\",\"agid\":100}','127.0.0.1','2014-07-21 07:54:00'),(472,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 02:08:34'),(473,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 03:18:00'),(474,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 03:18:12'),(475,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:16:51'),(476,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:17:23'),(477,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:30:59'),(478,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:32:43'),(479,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:32:46'),(480,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:33:17'),(481,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:33:21'),(482,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:35:09'),(483,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:35:13'),(484,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:35:29'),(485,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:35:32'),(486,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:36:35'),(487,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:36:39'),(488,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:37:09'),(489,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:37:11'),(490,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:37:23'),(491,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:37:26'),(492,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:38:19'),(493,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:38:23'),(494,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:39:27'),(495,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:39:31'),(496,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:39:49'),(497,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:39:52'),(498,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:40:53'),(499,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:40:56'),(500,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:41:56'),(501,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:42:00'),(502,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:45:15'),(503,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:45:37'),(504,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:46:33'),(505,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:47:01'),(506,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:47:51'),(507,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:48:13'),(508,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:49:44'),(509,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:50:11'),(510,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:52:29'),(511,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:53:34'),(512,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:54:17'),(513,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:54:20'),(514,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:57:12'),(515,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-27 06:57:28'),(516,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 06:58:19'),(517,1,'admin(超级管理员)','退出','','10.1.174.206','2014-08-27 07:58:01'),(518,0,'未登录用户','登录密码错误','uid:1, user:admin','10.1.174.206','2014-08-27 07:58:07'),(519,1,'admin(超级管理员)','登录','','10.1.174.206','2014-08-27 07:58:12'),(520,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-27 08:48:08'),(521,1,'admin(超级管理员)','退出','','10.1.174.206','2014-08-28 10:40:13'),(522,1,'admin(超级管理员)','登录','','10.1.174.206','2014-08-28 10:40:19'),(523,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-29 02:37:32'),(524,1,'admin(超级管理员)','退出','','127.0.0.1','2014-08-29 02:40:16'),(525,1,'admin(超级管理员)','登录','','127.0.0.1','2014-08-29 02:40:29'),(526,1,'admin(超级管理员)','创建数据Node','{\"pid\":84,\"name\":\"\\u83dc\\u5355\\u7ba1\\u7406\",\"url\":\"node\\/index\",\"id\":268}','10.1.174.206','2014-09-01 08:19:57'),(527,1,'admin(超级管理员)','创建数据AuthSet','{\"agid\":1,\"aid\":194,\"id\":253}','10.1.174.206','2014-09-01 08:56:20'),(528,1,'admin(超级管理员)','创建数据Node','{\"pid\":0,\"name\":\"\\u6d4b\\u8bd5\\u6dfb\\u52a0\\u83dc\\u5355\",\"url\":\"hello\\/index\",\"id\":269}','10.1.174.206','2014-09-01 09:28:06'),(529,1,'admin(超级管理员)','修改数据Node','{\"pid\":0,\"name\":\"\\u6d4b\\u8bd5\\u6dfb\\u52a0\\u83dc\\u53551\",\"url\":\"hello\\/index\",\"id\":269}','10.1.174.206','2014-09-01 09:28:15'),(530,1,'admin(超级管理员)','删除数据Node','{\"id\":\"269\"}','10.1.174.206','2014-09-01 09:28:20'),(531,1,'admin(超级管理员)','创建数据AuthSet','{\"agid\":1,\"aid\":193,\"id\":256}','10.1.174.206','2014-09-01 09:30:22'),(532,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-03 00:32:22'),(533,0,'未登录用户','登录密码错误','uid:, user:','10.1.174.206','2014-09-03 00:32:33'),(534,0,'未登录用户','登录密码错误','uid:, user:','10.1.174.206','2014-09-03 00:32:36'),(535,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-03 00:32:45'),(536,1,'admin(超级管理员)','创建数据User','{\"user\":\"test\",\"name\":\"TEST\",\"phone\":\"13800138000\",\"agid\":99,\"pwd\":\"e10adc3949ba59abbe56e057f20f883e\",\"ctime\":\"2014-09-03 08:33:14\",\"uid\":45}','10.1.174.206','2014-09-03 00:33:09'),(537,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-03 00:33:18'),(538,45,'test(TEST)','登录','','10.1.174.206','2014-09-03 00:33:26'),(539,45,'test(TEST)','登录','','10.1.169.85','2014-09-03 03:12:30'),(540,45,'test(TEST)','退出','','10.1.174.206','2014-09-03 05:50:34'),(541,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-03 05:51:35'),(542,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-03 06:06:28'),(543,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-03 06:08:42'),(544,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-03 07:31:26'),(545,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-03 07:31:34'),(546,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-03 08:17:16'),(547,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-03 08:17:22'),(548,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-03 08:55:46'),(549,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-03 08:55:51'),(550,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"95\"}','10.1.174.206','2014-09-03 09:08:07'),(551,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"97\"}','10.1.174.206','2014-09-03 09:08:19'),(552,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":1,\"nodeid\":263,\"agnid\":103}','10.1.174.206','2014-09-03 09:27:26'),(553,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":1,\"nodeid\":261,\"agnid\":104}','10.1.174.206','2014-09-03 09:27:38'),(554,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"101\"}','10.1.174.206','2014-09-03 09:28:39'),(555,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":1,\"nodeid\":267,\"agnid\":105}','10.1.174.206','2014-09-03 09:38:25'),(556,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-03 09:54:18'),(557,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-03 09:54:23'),(558,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"104\"}','10.1.174.206','2014-09-03 10:12:01'),(559,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"103\"}','10.1.174.206','2014-09-03 10:12:01'),(560,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-04 00:50:48'),(561,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-04 00:50:54'),(562,1,'admin(超级管理员)','修改数据SampleSubitem','{\"audit_status\":1003,\"subid\":1}','10.1.174.206','2014-09-04 05:47:00'),(563,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-04 06:28:57'),(564,0,'未登录用户','登录密码错误','uid:1, user:admin','10.1.174.206','2014-09-04 06:29:04'),(565,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-04 06:29:07'),(566,45,'test(TEST)','登录','','10.1.174.206','2014-09-04 06:36:40'),(567,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"35\"}','10.1.174.206','2014-09-04 06:45:00'),(568,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"9\"}','10.1.174.206','2014-09-04 06:45:00'),(569,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"38\"}','10.1.174.206','2014-09-04 06:45:01'),(570,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"37\"}','10.1.174.206','2014-09-04 06:45:01'),(571,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"34\"}','10.1.174.206','2014-09-04 06:45:01'),(572,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"36\"}','10.1.174.206','2014-09-04 06:45:01'),(573,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"8\"}','10.1.174.206','2014-09-04 06:45:01'),(574,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":99,\"nodeid\":197,\"agnid\":106}','10.1.174.206','2014-09-04 06:45:29'),(575,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"30\"}','10.1.174.206','2014-09-04 06:49:56'),(576,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":99,\"nodeid\":84,\"agnid\":107}','10.1.174.206','2014-09-04 06:50:29'),(577,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-04 07:01:10'),(578,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-04 07:01:18'),(579,1,'admin(超级管理员)','创建数据Node','{\"pid\":1,\"name\":\"1\",\"url\":\"1\",\"id\":270}','10.1.174.206','2014-09-04 07:08:43'),(580,1,'admin(超级管理员)','修改数据Node','{\"pid\":1,\"name\":\"2\",\"url\":\"1\",\"id\":270}','10.1.174.206','2014-09-04 07:08:51'),(581,1,'admin(超级管理员)','删除数据Node','{\"id\":\"270\"}','10.1.174.206','2014-09-04 07:15:22'),(582,1,'admin(超级管理员)','创建数据Node','{\"pid\":1,\"name\":\"1334491\",\"url\":\"1\",\"id\":271}','10.1.174.206','2014-09-04 07:15:50'),(583,1,'admin(超级管理员)','删除数据Node','{\"id\":\"271\"}','10.1.174.206','2014-09-04 07:15:56'),(584,1,'admin(超级管理员)','创建数据Node','{\"pid\":1,\"name\":\"2\",\"url\":\"3\",\"id\":272}','10.1.174.206','2014-09-04 07:25:58'),(585,1,'admin(超级管理员)','修改数据Node','{\"pid\":1,\"name\":\"2\",\"url\":\"34\",\"id\":272}','10.1.174.206','2014-09-04 07:26:14'),(586,1,'admin(超级管理员)','删除数据Node','{\"id\":\"272\"}','10.1.174.206','2014-09-04 07:29:15'),(587,1,'admin(超级管理员)','创建数据Node','{\"pid\":1,\"name\":\"1334491\",\"url\":\"1\",\"id\":273}','10.1.174.206','2014-09-04 07:31:07'),(588,1,'admin(超级管理员)','删除数据Node','{\"id\":\"273\"}','10.1.174.206','2014-09-04 07:31:11'),(589,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-04 07:41:37'),(590,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-04 07:41:45'),(591,1,'admin(超级管理员)','创建数据Node','{\"pid\":1,\"name\":\"133449\",\"url\":\"1\",\"id\":274}','10.1.174.206','2014-09-04 07:42:07'),(592,1,'admin(超级管理员)','删除数据Node','{\"id\":\"274\"}','10.1.174.206','2014-09-04 07:42:12'),(593,1,'admin(超级管理员)','退出','','10.1.174.206','2014-09-04 07:52:50'),(594,1,'admin(超级管理员)','登录','','10.1.174.206','2014-09-04 07:52:58'),(595,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"98\"}','10.1.174.206','2014-09-04 07:54:09'),(596,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"99\"}','10.1.174.206','2014-09-04 07:54:10'),(597,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"83\"}','10.1.174.206','2014-09-04 07:54:10'),(598,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"96\"}','10.1.174.206','2014-09-04 07:54:10'),(599,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"84\"}','10.1.174.206','2014-09-04 07:54:10'),(600,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"105\"}','10.1.174.206','2014-09-04 07:54:11'),(601,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"85\"}','10.1.174.206','2014-09-04 07:54:11'),(602,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":1,\"nodeid\":259,\"agnid\":108}','10.1.174.206','2014-09-04 08:01:44'),(603,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":1,\"nodeid\":260,\"agnid\":109}','10.1.174.206','2014-09-04 08:01:49'),(604,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"109\"}','10.1.174.206','2014-09-04 08:02:03'),(605,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"108\"}','10.1.174.206','2014-09-04 08:02:04'),(606,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":1,\"nodeid\":259,\"agnid\":110}','10.1.174.206','2014-09-04 08:07:47'),(607,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":1,\"nodeid\":260,\"agnid\":111}','10.1.174.206','2014-09-04 08:07:53'),(608,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"110\"}','10.1.174.206','2014-09-04 08:07:58'),(609,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"111\"}','10.1.174.206','2014-09-04 08:07:59'),(610,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":1,\"nodeid\":259,\"agnid\":112}','10.1.174.206','2014-09-04 08:08:16'),(611,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":1,\"nodeid\":260,\"agnid\":113}','10.1.174.206','2014-09-04 08:08:21'),(612,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"112\"}','10.1.174.206','2014-09-04 08:08:41'),(613,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"113\"}','10.1.174.206','2014-09-04 08:08:41'),(614,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"82\"}','10.1.174.206','2014-09-04 08:09:58'),(615,1,'admin(超级管理员)','创建数据Node','{\"pid\":1,\"name\":\"1\",\"url\":\"1\",\"id\":275}','10.1.174.206','2014-09-04 08:17:50'),(616,1,'admin(超级管理员)','删除数据Node','{\"id\":\"275\"}','10.1.174.206','2014-09-04 08:18:07'),(617,1,'admin(超级管理员)','创建数据Node','{\"pid\":2,\"name\":\"22\",\"url\":\"2\",\"id\":276}','10.1.174.206','2014-09-04 08:18:20'),(618,1,'admin(超级管理员)','删除数据Node','{\"id\":\"276\"}','10.1.174.206','2014-09-04 08:18:27'),(619,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"45\"}','10.1.174.206','2014-09-04 08:19:53'),(620,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"107\"}','10.1.174.206','2014-09-04 08:19:53'),(621,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"106\"}','10.1.174.206','2014-09-04 08:19:53'),(622,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"44\"}','10.1.174.206','2014-09-04 08:19:54'),(623,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"42\"}','10.1.174.206','2014-09-04 08:19:54'),(624,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"43\"}','10.1.174.206','2014-09-04 08:19:54'),(625,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"41\"}','10.1.174.206','2014-09-04 08:19:54'),(626,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"40\"}','10.1.174.206','2014-09-04 08:19:54'),(627,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"39\"}','10.1.174.206','2014-09-04 08:19:54'),(628,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"31\"}','10.1.174.206','2014-09-04 08:19:55'),(629,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"29\"}','10.1.174.206','2014-09-04 08:19:55'),(630,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"28\"}','10.1.174.206','2014-09-04 08:19:55'),(631,1,'admin(超级管理员)','创建数据AuthGroupNode','{\"agid\":99,\"nodeid\":182,\"agnid\":114}','10.1.174.206','2014-09-04 08:20:09'),(632,1,'admin(超级管理员)','删除数据AuthGroupNode','{\"agnid\":\"114\"}','10.1.174.206','2014-09-04 08:20:15'),(633,1,'admin(超级管理员)','删除数据AuthGroup','{\"agid\":\"100\"}','10.1.174.206','2014-09-04 08:24:31'),(634,1,'admin(超级管理员)','修改数据AuthGroup','{\"name\":\"\\u6d4b\\u8bd5\\u6743\\u9650\\u7ec4\",\"description\":\"\\u4ec5\\u4f9b\\u6d4b\\u8bd5\",\"agid\":99}','10.1.174.206','2014-09-04 08:24:43'),(635,45,'test(TEST)','退出','','10.1.174.206','2014-09-04 08:37:52'),(636,45,'test(TEST)','登录','','10.1.174.206','2014-09-04 08:38:00'),(637,45,'test(TEST)','退出','','10.1.174.206','2014-09-04 08:38:31');
/*!40000 ALTER TABLE `sys_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user` varchar(50) NOT NULL COMMENT '用户名',
  `agid` int(11) NOT NULL COMMENT '所属权限组ID',
  `pwd` char(32) NOT NULL COMMENT 'md5密码',
  `name` varchar(20) NOT NULL COMMENT '姓名',
  `phone` varchar(11) NOT NULL COMMENT '手机号',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '状态（0 启用 1 停用）',
  `ctime` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '创建时间',
  `mtime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `user_UNIQUE` (`user`),
  KEY `fk_agid_idx` (`agid`),
  CONSTRAINT `fk_agid` FOREIGN KEY (`agid`) REFERENCES `auth_group` (`agid`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin',1,'21232f297a57a5a743894a0e4a801fc3','超级管理员','13810713402',0,'2014-07-15 07:36:33','2014-07-21 07:51:27'),(45,'test',99,'e10adc3949ba59abbe56e057f20f883e','TEST','13800138000',0,'2014-09-03 00:33:14','2014-09-03 00:33:09');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_log`
--

DROP TABLE IF EXISTS `user_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_log` (
  `ulid` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `login_time` datetime NOT NULL COMMENT '登陆时间',
  `login_ip` varchar(15) DEFAULT NULL COMMENT '客户端IP',
  `login_count` int(11) DEFAULT '0' COMMENT '次数',
  PRIMARY KEY (`ulid`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_log`
--

LOCK TABLES `user_log` WRITE;
/*!40000 ALTER TABLE `user_log` DISABLE KEYS */;
INSERT INTO `user_log` VALUES (19,1,'2014-09-04 15:53:05','10.1.174.206',48),(20,45,'2014-09-04 16:38:06','10.1.174.206',4);
/*!40000 ALTER TABLE `user_log` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2014-09-04 16:40:00
