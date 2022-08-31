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
            getDepartmentsRoles();
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
              type: "list",
              message: "Choose the department",
              choices: departmentNames,
              name: "deptName"
          }])
          .then((answer => {
              db.query(`INSERT INTO employee_role (title, salary, department_id) VALUES ("${answer.newRole}", ${answer.salary}, ${departmentsIndexed[answer.deptName]});`, (err, res) => {
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
var rolesIndexed = {};
var roleNames = [];

const getDepartmentsRoles = () => {
  departmentsIndexed = {};
  departmentNames = [];
  rolesIndexed = {};
  roleNames = [];
  db.query(`SELECT * FROM department;`, (err, res) => {
    if (err) { console.log(err) }
    for (let i = 0; i < res.length; i++) {
        departmentsIndexed[res[i].name] = res[i].id;
        departmentNames.push(res[i].name);
    }
})
  db.query(`SELECT * FROM employee_role;`, (err, res) => {
    if (err) { console.log(err) }
    for (let i = 0; i < res.length; i++) {
      rolesIndexed[res[i].title] = res[i].department_id;
      roleNames.push(res[i].title);
    }
  })
}


const inquireAddEmployee = () => {
    return inquirer.prompt([{
        type: "input",
        name: "first",
        message: "Enter employee's first name",
            
    },
    {
        type: "input",
        name: "last",
        message: "Enter employee's Last name",
    },
    {
      type: "input",
          message: "enter the manager id",
          name: "managerId"
    },
    {
      type: "list",
          message: "Choose the role",
          choices: roleNames,
          name: "roleName"
    }])
    .then((answers) => {
      db.query(`INSERT INTO employee(first_name, last_name, manager_id, employee_role_id) VALUES ("${answers.first}", "${answers.last}", ${answers.managerId}, ${rolesIndexed[answers.roleName]});`);
    }
  )

  }

