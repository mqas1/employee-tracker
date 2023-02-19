const inquirer = require("inquirer");
const mysql = require('mysql2');
const Company = require("./lib/Company");

require('dotenv').config();

const connection = mysql.createConnection(
  {
    host:'localhost', 
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
  });

const db = new Company(connection);

const initializeApp = () => {
  inquirer.prompt(
    {
      type: "list",
      message: "What would you like to do?",
      choices: ["View All Departments", "View All Roles", "View All Employees", "Add a Department", "Add a Role", "Add an Employee", "Update an Employee Role", "End Session"],
      name: "menu"
    }
  )
  .then((response) => {
    const { menu } = response;
    if (menu !== "End Session"){
      if (menu === "View All Departments"){
        db.viewDepartments();
      }
      else if (menu === "View All Roles"){
        db.viewRoles();
      }
      else if (menu === "View All Employees"){
        db.viewEmployees();
      }
      else if (menu === "Add a Department"){
        db.addDepartment();
      }
      else if (menu === "Add a Role"){
        db.addRole();
      }
      else if (menu === "Add an Employee"){
        db.addEmployee();
      } else {
        db.updateEmployee();
      }
      initializeApp();
    } else {
      console.log("\nThank you for using the Content Management System!\nSession ended.");
      connection.end();
    }
  });
}

const init = () => {
  console.log("Welcome to the Content Management System!");
  initializeApp();
}

init();