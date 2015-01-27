-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Erstellungszeit: 24. Dez 2013 um 17:19
-- Server Version: 5.6.12
-- PHP-Version: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Datenbank: `puzzle-boy`
--
DROP DATABASE IF EXISTS `puzzle-boy`;
CREATE DATABASE IF NOT EXISTS `puzzle-boy` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_520_ci;
USE `puzzle-boy`;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_LEVEL_NAME` (`name`),
  UNIQUE KEY `UNIQUE_EMAIL` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci AUTO_INCREMENT=2 ;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`id`, `name`, `password`, `email`, `active`) VALUES
(1, 'hanjo', '*DF5A01F5DCBF1638CDEE03CADB9372F222DE9D5A', 'hanjo77@gmail.com', b'1');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `level`
--

CREATE TABLE IF NOT EXISTS `level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `data` text NOT NULL,
  `creator` int(11) NOT NULL,
  `active` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_LEVEL_CREATOR_USER_ID` (`creator`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci AUTO_INCREMENT=31 ;

--
-- Daten für Tabelle `level`
--

INSERT INTO `level` (`id`, `data`, `creator`, `active`) VALUES 
(1, '111111111111111111\n1   1        1   1\n1 2   l 11 n   0 1\n1   1        1   1\n111111111111111111', 1, b'1'),
(2, '1111111111111111\n1   1  AA  1   1\n1 2    BB    0 1\n1   1  CC  1   1\n1111111111111111', 1, b'1'),
(3, '11111111111111\n11111    1   1\n11111      0 1\n11111  AA1   1\n1   1e AA11111\n1 2      11111\n1   1    11111\n11111111111111', 1, b'1'),
(4, '111111111111111111\n11111333     11111\n1   13333 AA 1   1\n1 2   333 AA   0 1\n1   13333 AA 1   1\n11111333     11111\n111111111111111111', 1, b'1'),
(5, '1111111111111111\n11111      11111\n1   1      1   1\n1 2 3  iA    0 1\n1   1      1   1\n11111      11111\n1111111111111111', 1, b'1'),
(6, '111111111111111\n1   1 1 1 1   1\n1   1     1 0 1\n1   3  1  A   1\n1 2 1     1 * 1\n1   1 1 1 1   1\n111111111111111', 1, b'1'),
(7, '111111111111111\n11111     11111\n1     i d     1\n1             1\n1 2  o  d   0 1\n1             1\n1     i d     1\n11111     11111\n111111111111111', 1, b'1'),
(8, '11111111111111111\n1111    D    1111\n1111    D    1111\n1111A BCDFG H1111\n1   A BCDFG H   1\n1 2 A B E G H 0 1\n1   A B E G H   1\n1111  B   G  1111\n11111111111111111', 1, b'1'),
(9, '1111111111111111111\n1      1 A 1      1\n1      1   1      1\n1        h C      1\n1   2  i   D   0  1\n1        g E      1\n1      1   1      1\n1      1 B 1      1\n1111111111111111111', 1, b'1'),
(10, '1111111111111111\n1              1\n1     h e    0 1\n1      g       1\n1        e     1\n1 2   g f    * 1\n1              1\n1111111111111111', 1, b'1'),
(11, '11111111111\n1111   1111\n111     111\n111 f   111\n11   0   11\n11    h  11\n1  g   f  1\n1    1    1\n1 m     m 1\n1   AAA   1\n11111 11111\n111     111\n1111 2 1111\n1111   1111\n11111111111', 1, b'1'),
(12, '11111111111111111\n1 0  1     A    1\n1    1    11111 1\n1111 1 Bl   111 1\n1    1        1 1\n1 CCC111113  11 1\n1             1 1\n1 DE   1 1 FFF1 1\n1 DE     1      1\n1 D3 133   13 1 1\n1    1333  13 1 1\n1111113333  G 1 1\n1    133 3  G 1 1\n1    1333 1 G 1 1\n1    133331 G 1 1\n1 2  133331 G 1 1\n1      3331     1\n11111111111111111', 1, b'1'),
(13, '1111111111111\n1  1 3A31   1\n1  1  A 1   1\n1  1 BA  1  1\n1  1     1  1\n1  1331 C   1\n12  3333CDD01\n1  1331 C   1\n1  1     1  1\n1  1 EF  1  1\n1  1  F 1   1\n1  1 3F31   1\n1111111111111', 1, b'1'),
(14, '1111111111111111\n1   1      13331\n1 AA1 0    1   1\n1   3   BBB1CC 1\n11113   BBB1CC 1\n1 DD33  33313331\n1 DD333 33     1\n1 DD333        1\n1   333   333E 1\n1   1      33E 1\n1   1      33E 1\n111113     11111\n1    3   33  G 1\n1 FFF311133  G 1\n1     1233     1\n1111111111111111', 1, b'1'),
(15, '111111111111111111\n111111   111   111\n1   11 m     1   1\n1 0      1 g 1 o 1\n1   1111     A   1\n11111111 1 11111 1\n111111   1    11 1\n111111 e 1 l     1\n111111        o 11\n1   11 1 111    11\n1 2 3     11111111\n1   111   11111111\n111111111111111111', 1, b'1'),
(16, '11111111111111111111\n11111111    11111111\n1111111     11111111\n1111111 A 3 11111111\n1111111 A 3      111\n1    33 A11C       1\n1 2 1333AB CDDDE 0 1\n1    33 F11C   E   1\n1111111 F 3      111\n1111111 F   11111111\n1111111 F   11111111\n11111111    11111111\n11111111111111111111', 1, b'1'),
(17, '11111111111111\n1     11 g g 1\n1   k 1      1\n1    A1B     1\n11   A B 11 C1\n1  l A1B     1\n1     1     31\n1    11111 h31\n1 DD 01233   1\n1    1111    1\n1     1      1\n1  l E1F     1\n1    E F G1 H1\n11   E1F     1\n1   m 1      1\n1  3  11 h h 1\n11111111111111', 1, b'1'),
(18, '11111111111111111111\n1         AAAA     1\n1   11111 1111 1   1\n1   1  33313 B 1   1\n1   1  33113 CD1   1\n1   1  33333 C 1   1\n1   1  33333 C 1   1\n1   1  33333 O 1   1\n1   1EE313331F11   1\n1   1   1 GH1  1   1\n1   1   1 G 1  1   1\n1   1  I1  J K 1   1\n1 2 1   1 L MN 1 0 1\n1   1   1    N 1   1\n11111111111111111111', 1, b'1'),
(19, '111111111111111\n1  2 1111111111\n1    1111111111\n111  11 A 11111\n11  11  A  1111\n13311 BBB g 111\n1CC3DD EE    11\n11 FDD  GGHH 11\n111 DDf  I    1\n1111 J  KK  1 1\n1111  1   L11*1\n1111  111ML1111\n11111N111  1111\n11111 1111  111\n1111  11111 111\n1111 111111 111\n111# 11110  111\n111111111111111', 1, b'1'),
(20, '11111111111111111111\n11       0        11\n1  AABB CCDD EEFF  1\n1  AABB CCDD EEFF  1\n1 h  G HHIIJJ K  e 1\n11   G   II   K   11\n11  LL        MM  11\n1 f LL NNOOPP MM g 1\n1    QQ  OO  RR    1\n11   QQ SSTT RR   11\n11  UU  SSTT  VV  11\n11  UU        VV  11\n111111111 1111111111\n1                  1\n1        2         1\n11                11\n11111111111111111111', 1, b'1'),
(21, '1111111111\n1        1\n1 0 AA   1\n1        1\n11  111  1\n1 BBBCCC 1\n1        1\n1  11    1\n1  1233  1\n1111111111', 1, b'1'),
(22, '11111111111111111111\n1    11111111      1\n1       AA         1\n1    11111111      1\n111111111111 f    g1\n1  BB3333333   CCC 1\n12 DD3333333   CCC01\n1  EE3333333   CCC 1\n1111111111111      1\n1    1111111 e    h1\n1       FF         1\n1    1111111       1\n11111111111111111111', 1, b'1'),
(23, '11111111111111111\n11      1  AAA 11\n1       1       1\n1       13  B1  1\n1       131CC1  1\n1   2     1 31 01\n1       13  1   1\n1       13    D 1\n1       1 3   D 1\n11      1 EEE F11\n11111111111111111', 1, b'1'),
(24, '11111111111111111\n113  A   c     01\n11 1b BB  C h  11\n11 3 D   g   f 11\n11 33  33 3cE  11\n11 333   3  EF 11\n11GG3   3HH E d11\n11 b 1 3 HH  I 11\n11 J  K 3   31 11\n11 J f  f  h33 11\n11           L 11\n111  1     M LN11\n1133311 h OM dN11\n113 11    PP QN11\n1233 1  e 3R  311\n11111111111111111', 1, b'1'),
(25, '11111111111111111111\n111   f         1111\n111f    f a a g 1111\n111   A         1111\n11   BB   l      111\n11 CCBB h     e D111\n11 CC E F   h  G 111\n12   1 HI n  b J  01\n11 KK L M   g  N 111\n11 KKOO g     f P111\n11   OO   l      111\n111   Q         1111\n111e    e c c h 1111\n111   e         1111\n11111111111111111111', 1, b'1'),
(26, '111111111111111\n1111111111  111\n110  A  BB33111\n11 a     1 C111\n11 d f 1  1 111\n11  D  1EFFF111\n11G 3 HH  3 111\n11    1    3  1\n11333   133 1 1\n11   III1 1   1\n11 k III   3111\n11    111 m 111\n1  J1 1     111\n1     3 1 1 111\n111111111 1 111\n112 3   3  3111\n111111111111111', 1, b'1'),
(27, '11111111111111111111\n1                  1\n1   111111111111   1\n1   11111  11111   1\n1   11  A   B011   1\n1   11    a  C11   1\n1   11 n D    11   1\n1   1   1 d h  1   1\n1   1  11   E3 1   1\n1   11     11 11   1\n1   113   1 F 11   1\n1   113a G3   11   1\n1   11311  11111   1\n1   113111111111   1\n1   113111111111   1\n1 2                1\n1                  1\n11111111111111111111', 1, b'1'),
(28, '111111111111111111\n11 11111  11 1   1\n1   A   f C  3   1\n1   A  B  C  1   1\n1   A  B  C  1   1\n1   A  B  C  1   1\n1  0A *B #C $1   1\n1   A  B  C  1   1\n1   A  B  C  1   1\n1 E A  B  C  1   1\n1    e B   e 1 2 1\n111 1  1111  1   1\n111111111111111111', 1, b'1'),
(29, '111111111111111111\n1113A BB    11 C01\n111D  BB  a   EEF1\n111   GG   33 EE 1\n111 g 111 nH1  f 1\n111    11   II3  1\n111 m     J    K 1\n111   1 11311L K 1\n1113M      33    1\n1111 111 111 3 1 1\n111  13  111N3 331\n111 OOP 111   1  1\n1133OO3     3  Q31\n1  311111111111111\n12 111111111111111\n111111111111111111', 1, b'1'),
(30, '11111111111111111111\n1333333333133A B 111\n13333333131 C  D 111\n13331333331 C EE 111\n1333313333FGGG H I 1\n1231333333 JJ  H 0 1\n1333313333KLLL H M 1\n13331333331 N OO 111\n13333333131 N  P 111\n1333333333133Q R 111\n11111111111111111111', 1, b'1');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `origin`
--

CREATE TABLE IF NOT EXISTS `origin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_ORIGIN_NAME` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci AUTO_INCREMENT=4 ;

--
-- Daten für Tabelle `origin`
--

INSERT INTO `origin` (`id`, `name`) VALUES
(1, 'Puzzle Boy / Kwirk Gameboy'),
(2, 'Puzzle Boy 2 / A-mazing Tater'),
(3, 'Puzzle Boy PC-Engine');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `level_origin`
--

CREATE TABLE IF NOT EXISTS `level_origin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level_id` int(11) NOT NULL,
  `origin_id` int(11) NOT NULL,
  `difficulty_id` int(11) NOT NULL DEFAULT 1,
  `number` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_LEVEL_ORIGIN_LEVEL_ID` (`level_id`),
  KEY `FK_LEVEL_ORIGIN_ORIGIN_ID` (`origin_id`),
  KEY `FK_LEVEL_ORIGIN_DIFFICULTY_ID` (`difficulty_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci AUTO_INCREMENT=31 ;

--
-- Daten für Tabelle `level_origin`
--

INSERT INTO `level_origin` (`id`, `level_id`, `origin_id`, `difficulty_id`, `number`) VALUES
(1, 1, 1, 1, 1),
(2, 2, 1, 1, 2),
(3, 3, 1, 1, 3),
(4, 4, 1, 1, 4),
(5, 5, 1, 1, 5),
(6, 6, 1, 1, 6),
(7, 7, 1, 1, 7),
(8, 8, 1, 1, 8),
(9, 9, 1, 1, 9),
(10, 10, 1, 1, 10),
(11, 11, 1, 2, 1),
(12, 12, 1, 2, 2),
(13, 13, 1, 2, 3),
(14, 14, 1, 2, 4),
(15, 15, 1, 2, 5),
(16, 16, 1, 2, 6),
(17, 17, 1, 2, 7),
(18, 18, 1, 2, 8),
(19, 19, 1, 2, 9),
(20, 20, 1, 2, 10),
(21, 21, 1, 3, 1),
(22, 22, 1, 3, 2),
(23, 23, 1, 3, 3),
(24, 24, 1, 3, 4),
(25, 25, 1, 3, 5),
(26, 26, 1, 3, 6),
(27, 27, 1, 3, 7),
(28, 28, 1, 3, 8),
(29, 29, 1, 3, 9),
(30, 30, 1, 3, 10);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `difficulty`
--

CREATE TABLE IF NOT EXISTS `difficulty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_520_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQUE_DIFFICULTY_NAME` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_520_ci AUTO_INCREMENT=4 ;

--
-- Daten für Tabelle `difficulty`
--

INSERT INTO `difficulty` (`id`, `name`) VALUES
(1, 'Easy'),
(2, 'Medium'),
(3, 'Hard');

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `level`
--
ALTER TABLE `level`
  ADD CONSTRAINT `level_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `user` (`id`);

--
-- Constraints der Tabelle `level_origin`
--
ALTER TABLE `level_origin`
  ADD CONSTRAINT `level_origin_ibfk_1` FOREIGN KEY (`level_id`) REFERENCES `level` (`id`),
  ADD CONSTRAINT `level_origin_ibfk_2` FOREIGN KEY (`origin_id`) REFERENCES `origin` (`id`),
  ADD CONSTRAINT `level_origin_ibfk_3` FOREIGN KEY (`difficulty_id`) REFERENCES `difficulty` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

SHOW ENGINE INNODB STATUS;
