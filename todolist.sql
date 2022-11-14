-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 11, 2022 at 09:25 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todolist`
--
CREATE DATABASE IF NOT EXISTS `todolist` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
USE `todolist`;

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

CREATE TABLE `task` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `created` datetime NOT NULL,
  `finished` datetime DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `priority` enum('short','half','high') COLLATE utf8mb4_bin DEFAULT 'short',
  `status` enum('unresolved','resolving','resolved') COLLATE utf8mb4_bin DEFAULT 'unresolved',
  `deadline` datetime DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `todolist_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`id`, `title`, `created`, `finished`, `description`, `priority`, `status`, `deadline`, `user_id`, `todolist_id`) VALUES
(1, 'estudiar', '2022-10-11 19:42:27', NULL, 'python', 'half', 'unresolved', '2022-11-30 19:42:00', 2, NULL),
(2, 'estudiar', '2022-10-11 19:42:46', NULL, 'javascript', 'half', 'unresolved', '2022-11-30 19:42:00', 2, 3),
(3, 'estudiar ', '2022-10-11 19:43:07', '2022-11-11 20:05:51', 'nodejs', 'high', 'resolved', '2022-11-30 19:43:00', 2, 2),
(4, 'estudiar', '2022-10-11 19:43:21', '2022-11-11 20:05:58', 'mysql', 'half', 'resolved', '2022-11-30 19:43:00', 2, 2),
(5, 'estudiar', '2022-10-11 19:46:28', NULL, 'react', 'half', 'unresolved', '2022-11-30 19:46:00', 2, 3),
(6, 'Armar PC', '2022-10-11 20:03:16', NULL, 'terminar de armar la computadora', 'half', 'unresolved', '2022-11-24 20:03:00', 2, NULL),
(7, 'limpiar ', '2022-10-11 20:07:02', '2022-11-11 20:07:44', 'limpiar la notebook, cambiar pasta termica', 'high', 'resolved', '2022-11-23 20:06:00', 2, 4),
(8, 'reparacion', '2022-10-11 20:09:46', NULL, 'reparar la pc rota', 'high', 'unresolved', '2022-11-26 20:09:00', 3, NULL),
(9, 'estudiar', '2022-10-11 20:13:50', NULL, 'matematicas', 'half', 'unresolved', '2022-11-26 20:13:00', 4, NULL),
(10, 'repasar', '2022-10-11 20:14:06', NULL, 'programacion', 'half', 'unresolved', '2022-11-19 20:14:00', 4, NULL),
(11, 'terminar ejercicios', '2022-10-11 20:14:36', NULL, 'estructuras de datos', 'short', 'unresolved', '2022-11-18 20:14:00', 4, NULL),
(12, 'comprar', '2022-10-11 20:15:13', NULL, 'pan, leche, huevo', 'half', 'unresolved', '2022-11-17 20:15:00', 6, NULL),
(13, 'trabajo', '2022-10-11 20:15:39', NULL, 'cortar el pasto', 'high', 'unresolved', '2022-11-29 20:15:00', 6, 5),
(14, 'poda', '2022-10-11 20:16:00', NULL, 'podar las rosas del jardin', 'half', 'unresolved', '2022-11-24 20:15:00', 6, NULL),
(15, 'fumigar ', '2022-10-11 20:16:58', NULL, 'matar los insectos del jardin', 'half', 'unresolved', '2022-11-25 20:16:00', 6, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `task_assigned`
--

CREATE TABLE `task_assigned` (
  `id` int(11) NOT NULL,
  `assignedby` int(11) NOT NULL,
  `acepted` enum('yes','not') COLLATE utf8mb4_bin DEFAULT 'not',
  `assignedto` int(11) DEFAULT NULL,
  `task_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `task_assigned`
--

INSERT INTO `task_assigned` (`id`, `assignedby`, `acepted`, `assignedto`, `task_id`) VALUES
(1, 2, 'not', 3, 1),
(2, 2, 'not', 3, 6),
(3, 3, 'not', 2, 8);

-- --------------------------------------------------------

--
-- Table structure for table `todolist`
--

CREATE TABLE `todolist` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `created` datetime NOT NULL,
  `finished` datetime DEFAULT NULL,
  `status` enum('unresolved','resolving','resolved') COLLATE utf8mb4_bin DEFAULT 'unresolved',
  `archived` enum('yes','not') COLLATE utf8mb4_bin DEFAULT 'not',
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `todolist`
--

INSERT INTO `todolist` (`id`, `title`, `created`, `finished`, `status`, `archived`, `user_id`) VALUES
(1, 'lenguajes de programacion', '2022-10-11 19:43:42', NULL, 'unresolved', 'not', 2),
(2, 'backEnd', '2022-10-11 19:43:54', '2022-11-11 20:06:05', 'resolved', 'not', 2),
(3, 'FrontEnd', '2022-10-11 19:44:01', NULL, 'unresolved', 'not', 2),
(4, 'limpieza', '2022-10-11 20:07:30', '2022-11-11 20:07:49', 'resolved', 'yes', 2),
(5, 'jardineria', '2022-10-11 20:16:12', NULL, 'unresolved', 'not', 6);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `nick_name` varchar(255) COLLATE utf8mb4_bin NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `nick_name`, `email`, `password`) VALUES
(2, 'Daniel', 'kaiserkey2@gmail.com', '$2b$10$Db5HdxP8zAsEVpWBUyLKHOjW2w4UwpeC5/drUxxkgs2Dg7VkWv87a'),
(3, 'Juan', 'usuario3@gmail.com', '$2b$10$biVYMzVcQIWLx72iK2eyJuuLFDhwyrWYxACvM5uLZap9BXiSo2XaK'),
(4, 'Carlos', 'usuario4@gmail.com', '$2b$10$Z36SCuY2f575WxfVE8KUXeJsfZxCSYfoA.ChHyQQjosn2Lgik7nWa'),
(6, 'Juan', 'usuario5@gmail.com', '$2b$10$RpzYH5Ob9JYVCE8rGUOan.ArlTCRhM9AbSBeOoAHHiydQeE2wUwi6');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `task`
--
ALTER TABLE `task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `todolist_id` (`todolist_id`);

--
-- Indexes for table `task_assigned`
--
ALTER TABLE `task_assigned`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assignedto` (`assignedto`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `todolist`
--
ALTER TABLE `todolist`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `task`
--
ALTER TABLE `task`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `task_assigned`
--
ALTER TABLE `task_assigned`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `todolist`
--
ALTER TABLE `todolist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `task_ibfk_2` FOREIGN KEY (`todolist_id`) REFERENCES `todolist` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `task_assigned`
--
ALTER TABLE `task_assigned`
  ADD CONSTRAINT `task_assigned_ibfk_1` FOREIGN KEY (`assignedto`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `task_assigned_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `todolist`
--
ALTER TABLE `todolist`
  ADD CONSTRAINT `todolist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
