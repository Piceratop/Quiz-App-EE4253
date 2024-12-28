-- @block

-- Drops database if exists and creates new database with UTF-8 support
DROP DATABASE IF EXISTS quiz_app;
CREATE DATABASE quiz_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiz_app;

-- @block

-- Resets the database
DROP TABLE IF EXISTS WrongResponseRecords;
DROP TABLE IF EXISTS Answers;
DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS Users;

-- @block

-- Creates users table with UTF-8 support
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('user', 'admin') DEFAULT 'user'
);

-- @block

-- Creates questions table with UTF-8 support
CREATE TABLE IF NOT EXISTS Questions (
   id INTEGER PRIMARY KEY AUTO_INCREMENT,
   question TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
   question_type TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL CHECK (question_type IN ('MCQ', 'FillIn')),
   attempt_count INTEGER DEFAULT 0,
   correct_count INTEGER DEFAULT 0,
   shuffle BOOLEAN DEFAULT 1,
   created_by INT,
   FOREIGN KEY (created_by) REFERENCES Users(id)
);

-- @block

-- Creates answers table with UTF-8 support
CREATE TABLE IF NOT EXISTS Answers (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    question_id INTEGER,
    answer TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    correct BOOLEAN,
    FOREIGN KEY (question_id) REFERENCES Questions(id)
);

-- @block

-- Creates wrong response records
CREATE TABLE IF NOT EXISTS WrongResponseRecords (
    user_id INT,
    question_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (question_id) REFERENCES Questions(id),
    PRIMARY KEY (user_id, question_id)
);

-- @block

-- Create trigger for question deletion
DROP TRIGGER IF EXISTS before_question_delete;

DELIMITER //
CREATE TRIGGER before_question_delete
BEFORE DELETE ON Questions
FOR EACH ROW
BEGIN
    DELETE FROM Answers WHERE question_id = OLD.id;
    DELETE FROM WrongResponseRecords WHERE question_id = OLD.id;
END//
DELIMITER ;
