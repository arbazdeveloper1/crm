-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 08, 2025 at 05:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `crm`
--

-- --------------------------------------------------------

--
-- Table structure for table `form_data`
--

CREATE TABLE `form_data` (
  `id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `mco_description` varchar(255) DEFAULT NULL,
  `charge_type` enum('Single','Split') DEFAULT NULL,
  `mco_calculated` decimal(10,2) NOT NULL,
  `airline_default` varchar(2555) NOT NULL,
  `airline_names` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`airline_names`)),
  `airline_costs` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`airline_costs`)),
  `card_number` varchar(16) NOT NULL,
  `card_type` enum('Visa','MasterCard','Amex','Discover','Other') NOT NULL,
  `currency` varchar(3) NOT NULL,
  `expiration` date NOT NULL,
  `cvv` varchar(4) NOT NULL,
  `email` varchar(255) NOT NULL,
  `billing_phone` varchar(15) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `ticket_number` varchar(20) DEFAULT NULL,
  `arl_confirmation` varchar(6) DEFAULT NULL,
  `tfn` varchar(20) DEFAULT NULL,
  `subject_line` varchar(255) DEFAULT NULL,
  `billing_address` varchar(255) DEFAULT NULL,
  `passenger_details` mediumtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_data`
--

INSERT INTO `form_data` (`id`, `total_amount`, `mco_description`, `charge_type`, `mco_calculated`, `airline_default`, `airline_names`, `airline_costs`, `card_number`, `card_type`, `currency`, `expiration`, `cvv`, `email`, `billing_phone`, `full_name`, `dob`, `gender`, `ticket_number`, `arl_confirmation`, `tfn`, `subject_line`, `billing_address`, `passenger_details`) VALUES
(2, 1000.50, 'MCO for flight booking', 'Single', 500.25, '', '[\"Airline A\",\"Airline B\"]', '[200.75,300]', '4111111111111111', 'Visa', 'USD', '0000-00-00', '123', 'user@example.com', '+1234567890', 'John Doe', '1990-01-01', 'Male', '1234567890', 'CONFIR', 'TFN12345', 'Flight Booking Confirmation', '123 Test St, Test City, CA, 90001', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `userRole` enum('admin','agent','HOD') NOT NULL,
  `department` varchar(255) NOT NULL,
  `status` varchar(2555) NOT NULL,
  `extn` int(255) NOT NULL,
  `shift_time` varchar(255) NOT NULL,
  `allowed_ip` int(255) NOT NULL,
  `allowed_leaves` int(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `otp` varchar(6) DEFAULT NULL,
  `otpExpiry` varchar(2555) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `full_name`, `username`, `userRole`, `department`, `status`, `extn`, `shift_time`, `allowed_ip`, `allowed_leaves`, `password`, `email`, `otp`, `otpExpiry`) VALUES
(1, 'Admin user', 'admin', 'admin', 'META', 'Online', 0, '', 0, 0, '$2b$10$cX/wnbCJT0RePlFzs9hO9ez6EycEQvwvRGOmv9qvuk7Ygz04YJxvC', 'support@myflysupports.com', '861687', '0000-00-00 00:00:00'),
(40, 'testt', 'test', 'agent', 'PPC', '', 1013, '09:00 PM to 06:00 AM', 192168, 8, '$2b$10$cX/wnbCJT0RePlFzs9hO9ez6EycEQvwvRGOmv9qvuk7Ygz04YJxvC', 'test@gmail.com', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `form_data`
--
ALTER TABLE `form_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `form_data`
--
ALTER TABLE `form_data`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
