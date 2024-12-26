-- @block

-- Run this block to reset the database
DROP TABLE IF EXISTS Questions;
DROP TABLE IF EXISTS Users;

-- @block

-- Run this block to create users table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role ENUM('user', 'admin') DEFAULT 'user'
);

-- @block

-- Run this block to create questions table
CREATE TABLE IF NOT EXISTS Questions (
   id INTEGER PRIMARY KEY AUTO_INCREMENT,
   question TEXT NOT NULL,
   question_type TEXT NOT NULL CHECK (question_type IN ('MCQ', 'FillIn')),
   correct_answers JSON,
   possible_answers JSON,
   attempt_count INTEGER DEFAULT 0,
   correct_count INTEGER DEFAULT 0,
   shuffle BOOLEAN DEFAULT 1,
   created_by INT,
   FOREIGN KEY (created_by) REFERENCES Users(id)
);

-- @block

CREATE TABLE IF NOT EXISTS WrongResponseRecords (
    user_id INT,
    question_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (question_id) REFERENCES Questions(id),
    PRIMARY KEY (user_id, question_id)
);

-- @block

-- Ignore this block
-- SELECT * FROM Questions;
-- SELECT * FROM Users;
SELECT * FROM WrongResponseRecords;