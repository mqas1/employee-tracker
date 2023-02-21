const cTable = require("console.table");
const inquirer = require("inquirer");

function Company(connection) {
  this.connection = connection;
  
  this.viewDepartments = async () => {
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
    await inquirer.prompt(
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
      });
    });
  }

  this.addRole = async () => {
    let depArray = [];
    const [rows, fields] = await this.connection.promise().execute("SELECT id, name FROM department ORDER BY name;");
    let depResults = rows;
    depResults.forEach(department => {
      let name = department.name;
      depArray.push(name);
    });
  
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
    let roleArray = [];
    let mgrArray = [];
    
    const [rows, fields] = await this.connection.promise().execute("SELECT id, title FROM role ORDER BY title;");
    let roleResults = rows;
    roleResults.forEach(role => {
      let roles = role.title;
      roleArray.push(roles);
    });
    
    const results = await this.connection.promise().execute(`SELECT id, CONCAT(first_name, " ", last_name)\
    AS manager_name FROM employee ORDER BY last_name;`);
    let managerResults = results[0];
    managerResults.forEach(manager => {
      const managers = manager.manager_name;
      mgrArray.push(managers);
    });

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
    let empArray = [];
    let roleArray = [];

    const [rows, fields] = await this.connection.promise().execute(`SELECT id, CONCAT(first_name, " ", last_name)\
    AS employee_name FROM employee ORDER BY last_name`)
    let employeeResults = rows;
    employeeResults.forEach(employee => {
      let employees = employee.employee_name;
      empArray.push(employees);
    });

    const results = await this.connection.promise().execute(`SELECT id, title FROM role ORDER BY title`)
    let roleResults = results[0];
    roleResults.forEach(role => {
      let roles = role.title;
      roleArray.push(roles);
    });

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