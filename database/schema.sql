-- Database Schema
-- Dream Cyber Security Pakistan

SET FOREIGN_KEY_CHECKS = 0;

-- Users & Authentication
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL UNIQUE,
  `email` VARCHAR(120) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(20) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Site Settings & SEO
CREATE TABLE IF NOT EXISTS `settings` (
  `key_name` VARCHAR(80) PRIMARY KEY,
  `key_value` TEXT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Services Catalog
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `icon` VARCHAR(60) DEFAULT 'shield',
  `summary` VARCHAR(350) NOT NULL,
  `description` TEXT NOT NULL,
  `features` TEXT NULL,
  `benefits` TEXT NULL,
  `order_num` INT DEFAULT 0,
  `status` ENUM('active','inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Training Courses
CREATE TABLE IF NOT EXISTS `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(180) NOT NULL,
  `slug` VARCHAR(180) NOT NULL UNIQUE,
  `duration` VARCHAR(80) NOT NULL,
  `target_audience` TEXT NOT NULL,
  `overview` TEXT NOT NULL,
  `syllabus` TEXT NOT NULL,
  `what_you_will_learn` TEXT NOT NULL,
  `instructor_name` VARCHAR(120) NOT NULL,
  `instructor_designation` VARCHAR(120) NOT NULL,
  `instructor_bio` TEXT NULL,
  `instructor_photo` VARCHAR(255) NULL,
  `intro_video_url` VARCHAR(255) NULL,
  `order_num` INT DEFAULT 0,
  `status` ENUM('active','inactive') DEFAULT 'active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Course Gallery
CREATE TABLE IF NOT EXISTS `course_gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `course_id` INT NOT NULL,
  `title` VARCHAR(150) NULL,
  `image_path` VARCHAR(255) NOT NULL,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Team Members
CREATE TABLE IF NOT EXISTS `team` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(120) NOT NULL,
  `designation` VARCHAR(120) NOT NULL,
  `bio` TEXT NOT NULL,
  `photo` VARCHAR(255) NULL,
  `linkedin` VARCHAR(255) NULL,
  `twitter` VARCHAR(255) NULL,
  `github` VARCHAR(255) NULL,
  `email` VARCHAR(120) NULL,
  `order_num` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Portfolio
CREATE TABLE IF NOT EXISTS `portfolio` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(180) NOT NULL,
  `category` ENUM('Video Editing', 'Graphic Design', 'Web Development', 'AI Automation') NOT NULL,
  `client_name` VARCHAR(120) NULL,
  `client_logo` VARCHAR(255) NULL,
  `cover_image` VARCHAR(255) NULL,
  `video_url` VARCHAR(255) NULL,
  `description` TEXT NOT NULL,
  `order_num` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Video Gallery
CREATE TABLE IF NOT EXISTS `videos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(180) NOT NULL,
  `category` ENUM('Company Videos', 'Course Introduction Videos', 'Student Projects and Work', 'Tutorials and Educational Videos') NOT NULL,
  `video_type` ENUM('embed', 'upload') DEFAULT 'embed',
  `video_source` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `order_num` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Blog Posts & News
CREATE TABLE IF NOT EXISTS `posts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(220) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `category` VARCHAR(100) DEFAULT 'Updates',
  `tags` VARCHAR(255) NULL,
  `featured_image` VARCHAR(255) NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Frequently Asked Questions
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question` VARCHAR(255) NOT NULL,
  `answer` TEXT NOT NULL,
  `category` VARCHAR(80) DEFAULT 'General',
  `order_num` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Leads & Inquiries
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` ENUM('contact', 'course_inquiry', 'quote') DEFAULT 'contact',
  `target_name` VARCHAR(180) NULL,
  `name` VARCHAR(120) NOT NULL,
  `email` VARCHAR(120) NOT NULL,
  `phone` VARCHAR(60) NULL,
  `subject` VARCHAR(200) NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('unread', 'read', 'responded') DEFAULT 'unread',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Landing Pages
CREATE TABLE IF NOT EXISTS `landing_pages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `title` VARCHAR(200) NOT NULL,
  `meta_title` VARCHAR(200) NULL,
  `meta_description` TEXT NULL,
  `headline` VARCHAR(255) NOT NULL,
  `subheadline` TEXT NULL,
  `body_content` LONGTEXT NOT NULL,
  `cta_text` VARCHAR(100) DEFAULT 'Contact Us',
  `cta_link` VARCHAR(255) DEFAULT '/contact.php',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

