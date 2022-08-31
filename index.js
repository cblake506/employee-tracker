require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { inquireAddEmployee, viewAllEmployees, viewAllDepartments, viewAllRoles } = require('./lib/employeeQuestions');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    console.log(`Connected to the ${process.env.DB_NAME} database.`)
  );


const init = () => {
  return inquirer
    .prompt({
      type: "list",
          message: "Choose what you would like to do",
          choices: [
              "Add Employee",
              "View Departments",
              "View Employees",
              "View Roles",
              "Quit"
          ],
          name: "answers"
    })
    .then(({answers}) => {
      switch(answers){
          case "Add Employee":
            return inquireAddEmployee(db);
            break;
          case "View Employees":
            db.query(`SELECT * FROM employee;`, (err, res) => {
              console.log("\nList of employees:");
              const table = cTable.getTable(res)
              console.log(table);
              return init();
            })
            break;
          case "View Departments":
            db.query(`SELECT * FROM department;`, (err, res) => {
              console.log("\nList of departments:");
              const table = cTable.getTable(res)
              console.log(table);
              return init();
            })
            break;
          case "View Roles":
            db.query(`SELECT * FROM role;`, (err, res) => {
              console.log("\nList of roles:");
              const table = cTable.getTable(res)
              console.log(table);
              return init()
            })
            break;

          default:
              console.log("Goodbye")
              db.end();
              return false;
              
      }
    })
    .then((answers) => {
      if(answers){
        db.query(`INSERT INTO employee(first_name, last_name) VALUES ("${answers.first_name}", "${answers.last_name}");`);
        db.query(`SELECT * FROM employee;`, (err, res) => {
            console.log("\nList of employees:");
            const table = cTable.getTable(res)
            console.log(table);
            return init()
        })
      }

      return;
    });
}

init();