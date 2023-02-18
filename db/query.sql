USE employee_db;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
JOIN employee manager ON employee.manager_id = manager.id;
-- WHERE manager.manager_id IS NULL OR employee.manager_id IS NOT NULL;

SELECT * FROM employee;