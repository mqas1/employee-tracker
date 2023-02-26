const inquirer = require("inquirer");
const mysql = require('mysql2');
const Company = require("./lib/Company");

// Using the dotenv module to conceal the user's MySQL password
require('dotenv').config();

const connection = mysql.createConnection(
  {
    host:'localhost', 
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_db'
  });

// Declaring an instance of the constructor function with the MySQL database
const db = new Company(connection);

const initializeApp = () => {
  inquirer.prompt(
    {
      type: "list",
      message: "What would you like to do?",
      choices: ["View All Employees", "Add an Employee", "Update an Employee Role", "View All Roles", "Add a Role", "View All Departments", "Add a Department", "End Session"],
      name: "menu"
    }
  )
  .then(async (response) => {
    const { menu } = response;
    let dbQuery;
    if (menu !== "End Session"){
      if (menu === "View All Departments"){
        try {
          dbQuery = await db.viewDepartments();
          return dbQuery;
        } catch (err) {
          console.error(err);
        } finally {
          return initializeApp();
        }
      }
      else if (menu === "View All Roles"){
        try {
          dbQuery = await db.viewRoles();
          return dbQuery;
        } catch (err) {
          console.error(err);
        } finally {
          initializeApp();
        }
      }
      else if (menu === "View All Employees"){
        try {
          dbQuery = await db.viewEmployees();
          return dbQuery;
        } catch (err) {
          console.error(err);
        } finally {
          initializeApp();
        }
      }
      else if (menu === "Add a Department"){
        try {
          dbQuery = await db.addDepartment();
          return dbQuery;
        } catch (err) {
          console.error(err);
        } finally {
          initializeApp();
        }
      }
      else if (menu === "Add a Role"){
        try {
          dbQuery = await db.addRole();
          return dbQuery;
        } catch (err) {
          console.error(err);
        } finally {
          return initializeApp();
        }
      }
      else if (menu === "Add an Employee"){
        try {
          dbQuery = await db.addEmployee();
          return dbQuery;
        } catch (err) {
          console.error(err);
        } finally {
          initializeApp();
        }
      } else {
        try {
          dbQuery = await db.updateEmployee();
          return dbQuery;
        } catch (err) {
          console.error(err);
        } finally {
          return initializeApp();
        }
      }
    } else {
      console.log("\nThank you for using the Content Management System!\nSession ended.");
      connection.end();
      return
    }
  });
}

const init = () => {
  console.log("Welcome to the Content Management System!");
  initializeApp();
}

init();