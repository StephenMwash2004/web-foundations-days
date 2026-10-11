# School Database Design

## Students Table

The **students** table stores information about each student, including a unique student ID, first name, last name, and email address. The email field is marked as UNIQUE to ensure that no two students share the same email address.

---

## Courses Table

The **courses** table stores details about each course, including a unique course ID, course name, and instructor.

---

## Enrolments Table

The **enrolments** table records which students are enrolled in which courses. It also stores the student's grade for that course. The table contains foreign keys linking to both the students and courses tables.

The combination of **student_id** and **course_id** is marked as UNIQUE to prevent a student from enrolling in the same course more than once.

---

# Relationships

## One-to-Many Relationships

- One student can have many enrolments.
- One course can have many enrolments.

---

## Many-to-Many Relationship

Students and courses have a **many-to-many** relationship because:

- A student can enroll in many courses.
- A course can have many students.

A **join table (enrolments)** is required because relational databases cannot directly represent many-to-many relationships. The join table stores the connection between students and courses while allowing additional information such as grades to be stored.

---

# Index Recommendation

I would create an index on the **student_id** column in the enrolments table.

```sql
CREATE INDEX idx_student
ON enrolments(student_id);
```

### Reason

This index speeds up searches for all courses taken by a particular student, which is a common query in a school management system.

---

# SQL vs NoSQL

For a school management system, I would choose **SQL** rather than NoSQL. School data is highly structured and contains well-defined relationships between students, courses, and enrolments. SQL databases provide strong data integrity through primary keys, foreign keys, unique constraints, and transactions. These features help ensure accurate and consistent records, making SQL the better choice for managing educational data.