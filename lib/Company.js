const cTable = require("console.table");
const inquirer = require("inquirer");

function Company(connection) {
  this.connection = connection;
  this.viewDerpartments = () => {
    this.connection.promise().execute("SELECT * FROM department ORDER BY department.name;")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  this.viewRoles = () => {
    this.connection.promise().execute("SELECT role.id, role.title, department.name AS department,\
    role.salary FROM role JOIN department ON role.department_id = department.id;")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  this.viewEmployees = () => {
    this.connection.promise().execute("SELECT employee.id, employee.first_name, employee.last_name\
    , role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' '\
    , manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id\
    JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;")
    .then(([rows, fields]) => {
      console.table(rows);
    })
    .catch((err) => {
      console.error(err);
    });
  }
}

module.exports = Company;