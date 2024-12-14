-- @block

DROP TABLE IF EXISTS Questions;

-- @block

CREATE TABLE IF NOT EXISTS Questions (
   id INTEGER PRIMARY KEY AUTO_INCREMENT,
   question TEXT NOT NULL,
   question_type TEXT NOT NULL CHECK (question_type IN ('MCQ', 'FillIn')),
   correct_answer TEXT,
   choices JSON,
   correct_count INTEGER DEFAULT 0
);

-- @block

INSERT INTO Questions (question, question_type, correct_answer, choices, correct_count) VALUES
('What is the capital of France?', 'MCQ', 'Paris', '["Paris", "London", "Berlin", "Rome"]', 0),
('Complete the idiom: The quick brown fox jumps over the ___ dog.', 'FillIn', 'lazy', NULL, 0);

