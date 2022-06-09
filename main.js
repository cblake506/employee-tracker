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


inquirer
  .prompt({
    type: "list",
        message: "Choose what you would like to do",
        choices: [
            "Add Employee",
            "Quit"
        ],
        name: "answers"
  })
  .then(({answers}) => {
    switch(answers){
        case "Add Employee":
            inquirer.prompt([{
                type: "input",
                name: "first_name",
                message: "Enter employee's first name",
                    
            },
            {
                type: "input",
                name: "last_name",
                message: "Enter employee's Last name",
            }]).then((answers) => {
                db.query(`INSERT INTO employee(first_name, last_name) VALUES ("${answers.first_name}", "${answers.last_name}");`);
                // console.log("updated db:\n");
                // db.query(`USE employee_db;`);
                db.query(`SELECT * FROM employee;`, (err, res) => {
                    console.log("list of employees:");
                    console.table(res)
                });
                
            })
            break;
        default:
            console.log("End")
            db.end();
            break;
    }
  });
