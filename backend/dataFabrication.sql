-- Active: 1735400900076@@127.0.0.1@3306@quiz_app
-- @block

-- Insert sample users with Unicode usernames
INSERT INTO Users (username, password_hash, role) VALUES 
('José_Silva', '$2b$12$randomhashhere1', 'user'),
('María_García', '$2b$12$randomhashhere2', 'user'),
('Zürich_Admin', '$2b$12$randomhashhere3', 'admin');

-- @block

-- Insert questions with Unicode text and symbols
INSERT INTO Questions (question, question_type, created_by) VALUES 
('Which symbol represents "less than or equal to"?', 'MCQ', 1),
('What does the emoji 🌍 typically represent?', 'MCQ', 1),
('Which mathematical symbol means "approximately equal to"?', 'MCQ', 1),
('What does the Chinese character 愛 mean?', 'MCQ', 1);

-- @block

-- Insert answers with Unicode text and symbols
INSERT INTO Answers (question_id, answer, correct) VALUES 
(1, '≤', true),
(1, '>', false),
(1, '≥', false),
(2, 'Earth', true),
(2, 'Moon', false),
(2, 'Sun', false),
(3, '≈', true),
(3, '=', false),
(3, '~', false),
(4, 'Love', true),
(4, 'Hate', false),
(4, 'Peace', false);