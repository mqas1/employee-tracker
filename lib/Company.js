// Importing console.table module in order to display MySQL data in a more readable manner.
const cTable = require("console.table");
const inquirer = require("inquirer");

/* Creating a constructor function for all the prompts in the main menu.
It takes a MySQL connection as a parameter and uses that in all the following functions.
All the functions use async await, as well as the promise wrappers in mysql2 and Inquirer.
If they did not run asynchronously the application would no compile in the proper order.
*/
function Company(connection) {
  this.connection = connection;
  
  this.viewDepartments = async () => {
// The regular MySQL connection is "upgraded" to the promise wrapper in all the following functions.
    await this.connection.promise().execute("SELECT * FROM department ORDER BY department.name;")
    .then(([rows, fields]) => {
      console.log("\n");
      console.table(rows);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  this.viewRoles = async () => {
    await this.connection.promise().execute("SELECT role.id, role.title, department.name AS department,\
    role.salary FROM role JOIN department ON role.department_id = department.id;")
    .then(([rows, fields]) => {
      console.log("\n");
      console.table(rows);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  this.viewEmployees = async () => {
    await this.connection.promise().execute(`SELECT employee.id, employee.first_name, employee.last_name\
    , role.title, department.name AS department, role.salary, CONCAT(manager.first_name, " "\
    , manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id\
    JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id;`)
    .then(([rows, fields]) => {
      console.log("\n");
      console.table(rows);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  this.addDepartment = async () => {
/* Inquirer prompts in the constructor function are made asynchronous so all questions are presented to the user 
before returning to the main menu in the application. 
*/
    await inquirer.prompt(
      {
        type: "input",
        message: "What is the name of the department?",
        name: "depName"
      }
    )
    .then(async (response) => {
      const { depName } = response;
      await this.connection.promise().execute("INSERT INTO department (name) VALUES (?)", [depName])
      .then(([rows, fields]) => {
        console.log(`Added ${depName} to the database`);
      })
      .catch((err) => {
        console.error(err);
      });
    });
  }

  this.addRole = async () => {
/* When getting data from the MySQL database the id and required columns are selected.
The required columns are then returned as a new array using the .map() prototype to use the values in the Inquirer prompts.
The id is later used when adding the user submitted data to the database based on the relevant user choice.
This was decided as the least error prone route, rather than making a second database query for the id.
*/
    const [rows, fields] = await this.connection.promise().execute("SELECT id, name FROM department ORDER BY name;");
    let depResults = rows;
    const depArray = depResults.map((department) => department.name);

    await inquirer.prompt([
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
        choices: depArray,
        name: "roleDep"
      }
    ])
    .then(async (response) => {
      const { roleTitle, roleSalary, roleDep } = response;
      let depID; 
      let depChoice = depResults.filter((department) => {
        return department.name === roleDep;
      });
      depID = depChoice[0].id;
      
      await this.connection.promise().execute("INSERT INTO role (title, salary, department_id)\
      VALUES (?, ?, ?)", [roleTitle, parseFloat(roleSalary), depID])
      .then(([rows, fields]) => {
        console.log(`Added ${roleTitle} to the database`);
      })
      .catch((err) => {
        console.error(err);
      });
    });
  }

  this.addEmployee = async () => {
    const [rows, fields] = await this.connection.promise().execute("SELECT id, title FROM role ORDER BY title;");
    let roleResults = rows;
    const roleArray = roleResults.map((role) => role.title);
    
    const results = await this.connection.promise().execute(`SELECT id, CONCAT(first_name, " ", last_name)\
    AS manager_name FROM employee ORDER BY last_name;`);
    let managerResults = results[0];
    const mgrArray = managerResults.map((manager) => manager.manager_name);

    await inquirer.prompt([
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
        choices: roleArray,
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
      
      let roleChoice = roleResults.filter((role) => {
        return role.title === empRole;
      });
      
      roleID = roleChoice[0].id;
      
      let managerChoice = managerResults.filter((manager) => {
        return manager.manager_name === empManager;
      });
      
      managerID = empManager !== "None" ? managerChoice[0].id : null; 
     
      await this.connection.promise().execute("INSERT INTO employee (first_name, last_name, role_id, manager_id)\
      VALUES (?, ?, ?, ?)", [empFirstName, empLastName, roleID, managerID])
      .then(([rows, fields]) => {
        console.log(`Added ${empFirstName} ${empLastName} to the database`);
      })
      .catch((err) => {
        console.error(err);
      });
    });
  }

  this.updateEmployee = async () => {
    const [rows, fields] = await this.connection.promise().execute(`SELECT id, CONCAT(first_name, " ", last_name)\
    AS employee_name FROM employee ORDER BY last_name`)
    let employeeResults = rows;
    const empArray = employeeResults.map((employee) => employee.employee_name);

    const results = await this.connection.promise().execute(`SELECT id, title FROM role ORDER BY title`)
    let roleResults = results[0];
    const roleArray = roleResults.map((role) => role.title);

    await inquirer.prompt([
      {
        type: "list",
        message: "Which employee's role do you want to update?",
        choices: empArray,
        name: "empName"
      },
      {
        type: "list",
        message: "Which role do you want to assign the selected employee?",
        choices: roleArray,
        name: "roleName"
      }
    ])
    .then(async (response) => {
      const { empName, roleName } = response;
      let empID;
      let roleID;

      let empChoice = employeeResults.filter((employee) => {
        return employee.employee_name === empName;
      });
      
      empID = empChoice[0].id;

      let roleChoice = roleResults.filter((role) => {
        return role.title === roleName;
      });
      
      roleID = roleChoice[0].id;

      await this.connection.promise().execute(`UPDATE employee SET role_id = ? WHERE id = ?`, [roleID, empID])
      .then(([rows, fields]) => {
        console.log(`Updated ${empName}'s role`);
      })
      .catch((err) => {
        console.error(err);
      });
    });
  }
}

module.exports = Company;