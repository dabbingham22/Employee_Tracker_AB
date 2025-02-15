-- Insert departments
INSERT INTO department (name) 
VALUES
    ('Engineering'),
    ('Human Resources'),
    ('Finance'),
    ('Marketing')
    ;

-- Insert roles
INSERT INTO role (title, salary, department_id) 
VALUES
    ('Software Engineer', 90000, 1),
    ('Senior Software Engineer', 120000, 1),
    ('HR Manager', 80000, 2),
    ('Accountant', 75000, 3),
    ('Marketing Specialist', 70000, 4)
    ;

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES
    ('Alice', 'Johnson', 1, NULL),
    ('Bob', 'Smith', 2, 1),
    ('Charlie', 'Brown', 3, NULL),
    ('David', 'Wilson', 4, NULL),
    ('Eve', 'Davis', 5, NULL)
    ;