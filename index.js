require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

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
              "Add Role",
              "Add Department",
              "View Departments",
              "View Employees",
              "View Roles",
              "Quit"
          ],
          name: "answers"
    })
    .then(({answers}) => {
      switch(answers){
          case 'Add Employee':
            getDepartmentsRoles();
            return inquireAddEmployee();
            break;
          case 'Add Role':
            inquireAddRole();
            break;
          case 'Add Department':
            inquireAddDept();
            break;
          case 'View Employees':
            db.query(`SELECT * FROM employee;`, (err, res) => {
              console.log("\nList of employees:");
              const table = cTable.getTable(res)
              console.log(table);
              return init();
            })
            break;
          case 'View Departments':
            db.query(`SELECT * FROM department;`, (err, res) => {
              console.log("\nList of departments:");
              const table = cTable.getTable(res)
              console.log(table);
              return init();
            })
            break;
          case 'View Roles':
            db.query(`SELECT * FROM employee_role;`, (err, res) => {
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



const inquireAddRole = () => {
  inquirer.prompt(
      [
          {
              type: 'input',
              name: 'newRole',
              message: 'What is the role called?'
          },
          {
              type: 'input',
              name: 'salary',
              message: 'What is the salary for the role?'
          },
          {
              type: 'input',
              name: 'departmentId',
              message: 'What is the department id?'
          }])
          .then((answer => {
              db.query(`INSERT INTO employee_role (title, salary, department_id) VALUES ("${answer.newRole}", ${answer.salary}, ${answer.departmentId});`, (err, res) => {
                  console.log('Added new role');
                  return init()
              })
          }))
}


const inquireAddDept = () => {
  inquirer.prompt(
      [
          {
              type: 'input',
              name: 'name',
              message: 'What is the department called?'
          }
          ])
          .then((answer => {
              db.query(`INSERT INTO department(name) VALUES ("${answer.name}");`, (err, res) => {
                  console.log('Added new department');
                  return init()
              })
          }))
}

var departmentsIndexed = {};
var departmentNames = [];

const getDepartmentsRoles = () => {
  db.query(`SELECT * FROM department;`, (err, res) => {
    if (err) { console.log(err) }
    for (let i = 0; i < res.length; i++) {
        departmentsIndexed[res[i].name] = res[i].id;
        departmentNames.push(res[i].name);
    }
})
}


const inquireAddEmployee = () => {
    return inquirer.prompt([{
        type: "input",
        name: "first_name",
        message: "Enter employee's first name",
            
    },
    {
        type: "input",
        name: "last_name",
        message: "Enter employee's Last name",
    },
    {
      type: "list",
          message: "Choose the department",
          choices: departmentNames,
          name: "dept"
    }])
    .then(({answers}) => {
      console.log(answers)
    }
  )

  }

