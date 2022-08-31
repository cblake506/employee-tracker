const inquirer = require('inquirer');
const cTable = require('console.table');

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
    }])
}


module.exports = { inquireAddEmployee };