const cTable = require("console.table");
const inquirer = require("inquirer");

function Company(connection) {
  this.connection = connection;
  this.viewDepartments = () => {
    this.connection.promise().execute("SELECT * FROM department ORDER BY department.name;")
    .then(([rows, fields]) => {
      console.log("\n\n");
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
      console.log("\n\n");
      console.table(rows);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  this.viewEmployees = () => {
    this.connection.promise().execute(`SELECT employee.id, employee.first_name, employee.last_name\
    , role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " "\
    , manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id\
    JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;`)
    .then(([rows, fields]) => {
      console.log("\n\n");
      console.table(rows);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  this.addDepartment = () => {
    inquirer.prompt(
      {
        type: "input",
        message: "What is the name of the department?",
        name: "depName"
      }
    )
    .then((response) => {
      const { depName } = response;
      this.connection.promise().execute("INSERT INTO department (name) VALUES (?)", [depName])
      .then(([rows, fields]) => {
        console.log(`Added ${depName} to the database`);
      })
      .catch((err) => {
        console.error(err);
      })
    });
  }

  this.addRole = async () => {
    let depArray;
    const [rows, fields] = await this.connection.promise().execute("SELECT name FROM department ORDER BY name;");
    depArray = rows;

    inquirer.prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "roleTitle"
      },
      {
        type: "input",
        message: "What is the salary of the role?",
        name: "roleSalary"
      },
      {
        type: "list",
        message: "Which department does the role belong to?",
        choices: [...depArray],
        name: "roleDep"
      }
    ])
    .then(async (response) => {
      const { roleTitle, roleSalary, roleDep } = response;
      let depID; 
      const [rows, fields] = await this.connection.promise().execute("SELECT id FROM department WHERE name = ?", [roleDep]);
      depID = rows;
      this.connection.promise().execute("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [roleTitle, parseFloat(roleSalary), parseInt(depID)])
      .then(([rows, fields]) => {
        console.log(`Added ${roleTitle} to the database`);
      })
      .catch((err) => {
        console.error(err);
      });
    });
  }

  this.addEmployee = async () => {
    let roleArray;
    let mgrArray;
    const [rows, fields] = await this.connection.promise().execute("SELECT title FROM role ORDER BY title;");
    roleArray = rows;
    const results = await this.connection.promise().execute(`SELECT CONCAT(first_name, " ", last_name) AS manager FROM employee ORDER BY last_name;`);
    mgrArray = results[0];
  
    inquirer.prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "empFirstName"
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "empLastName"
      },
      {
        type: "list",
        message: "What is the employee's role?",
        choices: [...roleArray],
        name: "empRole"
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        choices: ["None", ...mgrArray],
        name: "empManager"
      }
    ])
    .then(async (response) => {
      const { empFirstName, empLastName, empRole, empManager } = response;
      let roleID; 
      let managerID;
      const [rows, fields] = await this.connection.promise().execute("SELECT id FROM role WHERE title = ?", [empRole]);
      roleID = rows;
      const results = await this.connection.promise().execute(`SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?`, [empManager]);
      managerID = empManager !== "None" ? parseInt(results) : null; 
      
      this.connection.promise().execute("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [empFirstName, empLastName, parseInt(roleID), managerID])
      .then(([rows, fields]) => {
        console.log(`Added ${empFirstName} ${empLastName} to the database`);
      })
      .catch((err) => {
        console.error(err);
      });
    });
  }

  this.updateEmployee = async () => {

  }
}

module.exports = Company;