-- ============================================
-- EmberGym Complete Database Schema with Sample Data
-- ============================================

-- Note: Railway database doesn't require CREATE DATABASE
-- DROP TABLE statements for clean import (Railway will create fresh)

-- Create Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `user_type` enum('member','trainer','admin') DEFAULT 'member',
  `profile_image` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_user_type` (`user_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Trainers Table
CREATE TABLE IF NOT EXISTS `trainers` (
  `trainer_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `specialization` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `certification` varchar(255) DEFAULT NULL,
  `hourly_rate` decimal(10,2) DEFAULT NULL,
  `rating` decimal(3,2) DEFAULT 0.00,
  `total_reviews` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`trainer_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `trainers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Classes Table
CREATE TABLE IF NOT EXISTS `classes` (
  `class_id` int(11) NOT NULL AUTO_INCREMENT,
  `class_name` varchar(100) NOT NULL,
  `class_type` enum('Yoga','HIIT','Strength','Cardio','Pilates','Boxing','CrossFit','Zumba','Dance') NOT NULL,
  `description` text DEFAULT NULL,
  `duration_minutes` int(11) NOT NULL,
  `intensity` enum('Low','Medium','High') DEFAULT 'Medium',
  `max_participants` int(11) DEFAULT 20,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`class_id`),
  KEY `idx_class_type` (`class_type`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Schedules Table
CREATE TABLE IF NOT EXISTS `schedules` (
  `schedule_id` int(11) NOT NULL AUTO_INCREMENT,
  `class_id` int(11) NOT NULL,
  `trainer_id` int(11) NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `room_location` varchar(100) DEFAULT NULL,
  `spots_available` int(11) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`schedule_id`),
  KEY `idx_class_id` (`class_id`),
  KEY `idx_trainer_id` (`trainer_id`),
  KEY `idx_day_time` (`day_of_week`,`start_time`),
  CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE,
  CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`trainer_id`) REFERENCES `trainers` (`trainer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Bookings Table
CREATE TABLE IF NOT EXISTS `bookings` (
  `booking_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `schedule_id` int(11) NOT NULL,
  `booking_date` date NOT NULL,
  `status` enum('confirmed','cancelled','completed','no_show') DEFAULT 'confirmed',
  `checked_in` tinyint(1) DEFAULT 0,
  `check_in_time` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `cancelled_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`booking_id`),
  UNIQUE KEY `unique_booking` (`user_id`,`schedule_id`,`booking_date`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_schedule_id` (`schedule_id`),
  KEY `idx_booking_date` (`booking_date`),
  KEY `idx_status` (`status`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `schedules` (`schedule_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Membership Plans Table
CREATE TABLE IF NOT EXISTS `membership_plans` (
  `plan_id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `duration_days` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`plan_id`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create User Memberships Table
CREATE TABLE IF NOT EXISTS `user_memberships` (
  `membership_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('active','expired','cancelled') DEFAULT 'active',
  `payment_status` enum('paid','pending','failed') DEFAULT 'pending',
  `amount_paid` decimal(10,2) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`membership_id`),
  KEY `plan_id` (`plan_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_end_date` (`end_date`),
  CONSTRAINT `user_memberships_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_memberships_ibfk_2` FOREIGN KEY (`plan_id`) REFERENCES `membership_plans` (`plan_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Contact Requests Table
CREATE TABLE IF NOT EXISTS `contact_requests` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(200) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `class_type` varchar(100) DEFAULT NULL,
  `preferred_date` date DEFAULT NULL,
 `preferred_time` time DEFAULT NULL,
  `message` text DEFAULT NULL,
  `status` enum('new','contacted','resolved','spam') DEFAULT 'new',
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`request_id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `contact_requests_ibfk_1` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Reviews Table
CREATE TABLE IF NOT EXISTS `reviews` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `class_id` int(11) DEFAULT NULL,
  `trainer_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `review_text` text DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`review_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_class_id` (`class_id`),
  KEY `idx_trainer_id` (`trainer_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`class_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`trainer_id`) REFERENCES `trainers` (`trainer_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create Attendance Table
CREATE TABLE IF NOT EXISTS `attendance` (
  `attendance_id` int(11) NOT NULL AUTO_INCREMENT,
  `booking_id` int(11) NOT NULL,
  `attended` tinyint(1) DEFAULT 0,
  `check_in_time` timestamp NULL DEFAULT NULL,
  `check_out_time` timestamp NULL DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`attendance_id`),
  KEY `idx_booking_id` (`booking_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert Users (Members, Trainers, Admin)
INSERT INTO `users` (`email`, `password_hash`, `first_name`, `last_name`, `phone`, `date_of_birth`, `gender`, `user_type`, `profile_image`, `is_active`) VALUES
('sarah.johnson@embergym.com', '$2b$10$placeholder', 'Sarah', 'Johnson', '+63-917-1234567', '1990-05-15', 'Female', 'trainer', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400', 1),
('mike.chen@embergym.com', '$2b$10$placeholder', 'Mike', 'Chen', '+63-917-2345678', '1988-08-22', 'Male', 'trainer', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400', 1),
('emma.rodriguez@embergym.com', '$2b$10$placeholder', 'Emma', 'Rodriguez', '+63-917-3456789', '1992-03-10', 'Female', 'trainer', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400', 1),
('alex.kim@embergym.com', '$2b$10$placeholder', 'Alex', 'Kim', '+63-917-4567890', '1985-12-05', 'Male', 'trainer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400', 1),
('admin@embergym.com', '$2b$10$placeholder', 'Admin', 'User', '+63-917-5678901', '1980-01-01', 'Other', 'admin', NULL, 1),
('member1@example.com', '$2b$10$placeholder', 'John', 'Doe', '+63-917-6789012', '1995-06-20', 'Male', 'member', NULL, 1),
('member2@example.com', '$2b$10$placeholder', 'Jane', 'Smith', '+63-917-7890123', '1993-09-14', 'Female', 'member', NULL, 1),
('member3@example.com', '$2b$10$placeholder', 'Carlos', 'Santos', '+63-917-8901234', '1991-11-30', 'Male', 'member', NULL, 1);

-- Insert Trainers (linked to user accounts)
INSERT INTO `trainers` (`user_id`, `specialization`, `bio`, `experience_years`, `certification`, `hourly_rate`, `rating`, `total_reviews`) VALUES
(1, 'Yoga & Mindfulness', 'Sarah brings a holistic approach to fitness, combining traditional yoga practices with modern strength training techniques. Certified RYT-500 instructor with specialization in Vinyasa Flow and Power Yoga.', 8, 'RYT-500, Mindfulness Coach', 1500.00, 4.95, 127),
(2, 'HIIT & Strength Training', 'Mike specializes in high-intensity interval training and functional strength building. Former competitive athlete with a passion for helping clients exceed their fitness goals.', 6, 'NASM-CPT, CrossFit Level 2', 1800.00, 4.88, 95),
(3, 'Dance & Cardio Fitness', 'Emma combines her background in professional dance with fitness training to create engaging, high-energy cardio workouts. Specializes in Zumba, dance cardio, and body sculpting.', 5, 'Zumba Instructor, ACE Certified', 1400.00, 4.92, 103),
(4, 'Boxing & Martial Arts', 'Alex is a former amateur boxer who brings discipline and technique to every training session. Specializes in boxing fitness, kickboxing, and self-defense training.', 10, 'USA Boxing Coach, NASM-PES', 2000.00, 4.97, 156);

-- Insert Classes
INSERT INTO `classes` (`class_name`, `class_type`, `description`, `duration_minutes`, `intensity`, `max_participants`, `image_url`, `is_active`) VALUES
('Morning Flow Yoga', 'Yoga', 'Start your day with energizing yoga sequences that build strength and flexibility', 60, 'Medium', 20, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600', 1),
('Power Yoga', 'Yoga', 'Intense yoga practice combining strength, flexibility, and cardio', 75, 'High', 15, 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=600', 1),
('HIIT Blast', 'HIIT', 'High-intensity interval training for maximum calorie burn and endurance', 45, 'High', 25, 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=600', 1),
('Strength & Conditioning', 'Strength', 'Build muscle and increase strength with progressive weight training', 60, 'Medium', 15, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600', 1),
('Boxing Basics', 'Boxing', 'Learn boxing fundamentals while getting an incredible workout', 60, 'Medium', 12, 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=600', 1),
('Fight Cardio', 'Boxing', 'High-energy boxing and kickboxing cardio workout', 45, 'High', 20, 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=600', 1),
('Zumba Party', 'Zumba', 'Dance fitness party with Latin and international music', 60, 'Medium', 30, 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600', 1),
('CrossFit WOD', 'CrossFit', 'Workout of the Day - constantly varied functional movements', 60, 'High', 15, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', 1);

-- Insert Schedules
INSERT INTO `schedules` (`class_id`, `trainer_id`, `day_of_week`, `start_time`, `end_time`, `room_location`, `spots_available`, `is_active`) VALUES
-- Monday
(1, 1, 'Monday', '06:00:00', '07:00:00', 'Studio A', 20, 1),
(3, 2, 'Monday', '07:30:00', '08:15:00', 'Studio B', 25, 1),
(5, 4, 'Monday', '18:00:00', '19:00:00', 'Boxing Ring', 12, 1),
-- Tuesday
(7, 3, 'Tuesday', '06:30:00', '07:30:00', 'Studio A', 30, 1),
(4, 2, 'Tuesday', '18:00:00', '19:00:00', 'Weight Room', 15, 1),
(2, 1, 'Tuesday', '19:30:00', '20:45:00', 'Studio A', 15, 1),
-- Wednesday
(3, 2, 'Wednesday', '06:00:00', '06:45:00', 'Studio B', 25, 1),
(6, 4, 'Wednesday', '18:30:00', '19:15:00', 'Boxing Ring', 20, 1),
(1, 1, 'Wednesday', '19:30:00', '20:30:00', 'Studio A', 20, 1),
-- Thursday
(8, 2, 'Thursday', '06:30:00', '07:30:00', 'CrossFit Zone', 15, 1),
(7, 3, 'Thursday', '18:00:00', '19:00:00', 'Studio A', 30, 1),
-- Friday
(2, 1, 'Friday', '06:00:00', '07:15:00', 'Studio A', 15, 1),
(4, 2, 'Friday', '18:00:00', '19:00:00', 'Weight Room', 15, 1),
(6, 4, 'Friday', '19:30:00', '20:15:00', 'Boxing Ring', 20, 1),
-- Saturday
(7, 3, 'Saturday', '08:00:00', '09:00:00', 'Studio A', 30, 1),
(8, 2, 'Saturday', '09:30:00', '10:30:00', 'CrossFit Zone', 15, 1),
(5, 4, 'Saturday', '10:00:00', '11:00:00', 'Boxing Ring', 12, 1),
-- Sunday
(1, 1, 'Sunday', '08:00:00', '09:00:00', 'Studio A', 20, 1),
(3, 2, 'Sunday', '09:30:00', '10:15:00', 'Studio B', 25, 1);

-- Insert Membership Plans
INSERT INTO `membership_plans` (`plan_name`, `description`, `duration_days`, `price`, `features`, `is_active`) VALUES
('Basic Monthly', 'Perfect for getting started with your fitness journey', 30, 2500.00, '["Access to all group classes", "Locker room access", "Free fitness assessment", "Online booking"]', 1),
('Premium Monthly', 'Everything you need for serious training', 30, 4000.00, '["All Basic features", "Unlimited class bookings", "2 personal training sessions/month", "Priority class registration", "Nutrition consultation", "Free guest passes (2/month)"]', 1),
('6-Month Package', 'Commit to your goals and save', 180, 21000.00, '["All Premium features", "15% discount", "4 personal training sessions/month", "Body composition analysis (monthly)", "Workout plan customization"]', 1),
('Annual Elite', 'Best value for dedicated fitness enthusiasts', 365, 36000.00, '["All Premium features", "25% discount", "Unlimited personal training", "Priority equipment access", "Quarterly fitness assessments", "Exclusive member events", "Free EmberGym merchandise"]', 1);

-- Insert Sample Bookings
INSERT INTO `bookings` (`user_id`, `schedule_id`, `booking_date`, `status`, `checked_in`) VALUES
(6, 1, '2026-02-17', 'confirmed', 0),
(6, 2, '2026-02-17', 'confirmed', 0),
(7, 1, '2026-02-17', 'confirmed', 0),
(7, 4, '2026-02-18', 'confirmed', 0),
(8, 2, '2026-02-17', 'confirmed', 0),
(8, 5, '2026-02-18', 'confirmed', 0);

-- Insert Sample Memberships
INSERT INTO `user_memberships` (`user_id`, `plan_id`, `start_date`, `end_date`, `status`, `payment_status`, `amount_paid`) VALUES
(6, 2, '2026-02-01', '2026-03-03', 'active', 'paid', 4000.00),
(7, 1, '2026-02-10', '2026-03-12', 'active', 'paid', 2500.00),
(8, 3, '2026-01-15', '2026-07-14', 'active', 'paid', 21000.00);

-- Insert Sample Reviews
INSERT INTO `reviews` (`user_id`, `class_id`, `trainer_id`, `rating`, `review_text`, `is_approved`) VALUES
(6, 1, 1, 5, 'Sarah is an amazing instructor! Her morning yoga class is the perfect way to start the day.', 1),
(7, 3, 2, 5, 'Mike pushes you to your limits but in the best way possible. Great workout!', 1),
(8, 7, 3, 5, 'Emma makes Zumba so much fun! I dont even realize Im exercising.', 1),
(6, 5, 4, 5, 'Alex is patient and professional. Learning proper boxing technique has been awesome.', 1);

-- Insert Sample Contact Requests
INSERT INTO `contact_requests` (`full_name`, `email`, `phone`, `class_type`, `preferred_date`, `preferred_time`, `message`, `status`) VALUES
('Maria Garcia', 'maria@example.com', '+63-917-9012345', 'Yoga', '2026-02-20', '18:00:00', 'Interested in joining yoga classes for beginners', 'new'),
('Robert Lee', 'robert@example.com', '+63-917-0123456', 'Boxing', '2026-02-22', '19:00:00', 'Want to inquire about personal boxing training', 'new');
