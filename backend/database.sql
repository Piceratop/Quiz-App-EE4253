-- @block

DROP TABLE IF EXISTS Questions;

-- @block

CREATE TABLE IF NOT EXISTS Questions (
   id INTEGER PRIMARY KEY AUTO_INCREMENT,
   question TEXT NOT NULL,
   question_type TEXT NOT NULL CHECK (question_type IN ('MCQ', 'FillIn')),
   correct_answers JSON,
   possible_answers JSON,
   attempt_count INTEGER DEFAULT 0,
   correct_count INTEGER DEFAULT 0,
   shuffle BOOLEAN DEFAULT 1
);

-- @block

TRUNCATE Questions;

-- @block

INSERT INTO Questions(question, question_type, correct_answers, possible_answers, shuffle) VALUES
('What is the default port number for MySQL?', 'MCQ', JSON_ARRAY('3306'), JSON_ARRAY('1433', '1521', '3306', '5432'), 1),
('Which SQL command is used to create a new table in a MySQL database?', 'MCQ', JSON_ARRAY('CREATE TABLE'), JSON_ARRAY('CREATE DATABASE', 'CREATE TABLE', 'INSERT INTO', 'ALTER TABLE'), 1),
('Which of the following is a valid MySQL data type for storing a date?', 'MCQ', JSON_ARRAY('TIMESTAMP'), JSON_ARRAY('TIMESTAMP', 'DATE', 'DATETIME'), 1),
('How do you retrieve all the records from a table named employees?', 'MCQ', JSON_ARRAY('SELECT * FROM employees;'), JSON_ARRAY('SELECT * FROM employees;', 'GET * FROM employees;', 'FETCH ALL FROM employees;', 'RETRIEVE * FROM employees;'), 1),
('What does the acronym ACID stand for in the context of database transactions?', 'MCQ', JSON_ARRAY('Atomicity, Consistency, Isolation, Durability'), JSON_ARRAY('Atomicity, Consistency, Isolation, Durability', 'Accuracy, Consistency, Integrity, Durability', 'Atomicity, Consistency, Integrity, Database', 'Accuracy, Compliance, Isolation, Durability'), 1),
('True or False: The MySQL function used to return the current date and time is called CURRENT_TIME().', 'MCQ', JSON_ARRAY('False'), JSON_ARRAY('True', 'False'), 1),
('What is the purpose of the JOIN clause in SQL?', 'MCQ', JSON_ARRAY('To combine rows from two or more tables'), JSON_ARRAY('To delete records', 'To combine rows from two or more tables', 'To insert records into a table', 'To update existing records'), 1),
('Which command is used to remove a table from a database in MySQL?', 'MCQ', JSON_ARRAY('DROP TABLE'), JSON_ARRAY('DELETE TABLE', 'DROP TABLE', 'REMOVE TABLE', 'DESTROY TABLE'), 1);