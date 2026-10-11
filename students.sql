-- Create Students Table
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- Create Courses Table
CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100) NOT NULL,
    instructor VARCHAR(100) NOT NULL
);

-- Create Enrolments Table
CREATE TABLE enrolments (
    enrolment_id INT PRIMARY KEY,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    grade VARCHAR(2),

    FOREIGN KEY (student_id)
        REFERENCES students(student_id),

    FOREIGN KEY (course_id)
        REFERENCES courses(course_id),

    UNIQUE (student_id, course_id)
);

-----------------------------------------------------
-- Insert Students
-----------------------------------------------------

INSERT INTO students
VALUES
(1,'Stephen','Thiongo','stephen@example.com'),
(2,'Mary','Wanjiku','mary@example.com'),
(3,'John','Kamau','john@example.com');

-----------------------------------------------------
-- Insert Courses
-----------------------------------------------------

INSERT INTO courses
VALUES
(101,'Database Systems','Dr. Otieno'),
(102,'Web Development','Mrs. Achieng'),
(103,'Computer Networks','Mr. Mwangi');

-----------------------------------------------------
-- Insert Enrolments
-----------------------------------------------------

INSERT INTO enrolments
VALUES
(1,1,101,'A'),
(2,1,102,'B'),
(3,2,101,'B'),
(4,2,103,'A'),
(5,3,102,'C');

-----------------------------------------------------
-- Query 1
-- All courses for one student (Stephen)
-----------------------------------------------------

SELECT
    s.first_name,
    s.last_name,
    c.course_name
FROM students s
JOIN enrolments e
    ON s.student_id = e.student_id
JOIN courses c
    ON c.course_id = e.course_id
WHERE s.first_name = 'Stephen';

-----------------------------------------------------
-- Query 2
-- All students on one course
-----------------------------------------------------

SELECT
    c.course_name,
    s.first_name,
    s.last_name
FROM courses c
JOIN enrolments e
    ON c.course_id = e.course_id
JOIN students s
    ON s.student_id = e.student_id
WHERE c.course_name = 'Database Systems';

-----------------------------------------------------
-- Query 3
-- Number of students per course
-----------------------------------------------------

SELECT
    c.course_name,
    COUNT(e.student_id) AS total_students
FROM courses c
LEFT JOIN enrolments e
    ON c.course_id = e.course_id
GROUP BY c.course_name;

-----------------------------------------------------
-- Query 4
-- Students with no enrolments
-----------------------------------------------------

SELECT
    s.first_name,
    s.last_name
FROM students s
LEFT JOIN enrolments e
    ON s.student_id = e.student_id
WHERE e.student_id IS NULL;

-----------------------------------------------------
-- Query 5
-- Update one enrolment grade
-----------------------------------------------------

UPDATE enrolments
SET grade = 'A'
WHERE enrolment_id = 5;