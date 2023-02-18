USE employee_db;

INSERT INTO department (name)
VALUES 
    ("Editorial"),
    ("Advertising"),
    ("Legal"),
    ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Editor", 150000, 1),
    ("Journalist", 110000, 1),
    ("Lead Copywriter", 130000, 2),
    ("Copywriter", 90000, 2),
    ("Legal Team Lead", 200000, 3),
    ("Lawyer", 180000, 3),
    ("Sales Lead", 100000, 4),
    ("Salesperson", 80000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("John", "Hooker", 1, null),
    ("Alexandra", "Kennedy", 2, 1),
    ("Sophia", "Lombardi", 3, null),
    ("Parminder", "Singh", 4, 3),
    ("Simon", "Huxtable", 5, null),
    ("Fen", "Li", 6, 5),
    ("Anna", "Nowak", 7, null),
    ("Samuel", "Brewer", 8, 7);

SELECT * FROM department; 
SELECT * FROM role;
SELECT * FROM employee;