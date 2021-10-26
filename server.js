const express = require('express');
const routes = require('./routes/index.js');
const inquirer = require('inquirer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);


const mainPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: "What would you like to do?",
            name: "choice",
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role',
             'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
        }
    ])
    .then(data => {
        switch(data.choice) {
            case 'View All Employees':
                showEmployees();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Update Employee Role':
                updateEmployee();
                break;
            case 'View All Roles':
                showRoles();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'View All Departments':
                showDepartments();
                break;
            case 'Add Department':
                addDepartment();
                break;
            default:
                console.log('Error, not a given choice!');

        }
    })
}

const showEmployees = () => {}
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: "First Name: ",
            name: 'first_name',
        },
        {
            type: 'input',
            message: "Last Name: ",
            name: 'last_name',
        },
        {
            type: 'list',
            message: "Role: ",
            name: 'role',
            choices: ['Sales Lead', 'Lead Engineer', 'Account Manager', 'Lawyer']
        },
        {
            type: 'list',
            message: "Manager in charge: ",
            name: 'manager',
            choices: ['John Doe', 'Ashley Rodriguez', 'Kunal Singh', 'Tom Allen']
        },
    ])
    .then(data => {
        console.log(data);
    });
}
const updateEmployee = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: "Employee's role you want to update: ",
            name: 'employee',
            choices: ['Engineering', 'Finance', 'Legal', 'Sales']
        },
        {
            type: 'list',
            message: "Role you want to assign to the employee: ",
            name: 'role',
            choices: ['Engineering', 'Finance', 'Legal', 'Sales']
        },
    ])
    .then(data => {
        console.log(data);
    });
}
const showRoles = () => {}
const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: "Name of the Role: ",
            name: 'role_name',
        },
        {
            type: 'input',
            message: "Salary of the Role: ",
            name: 'role_salary',
        },
        {
            type: 'list',
            message: "Department in which the Role belongs to: ",
            name: 'role_department',
            choices: ['Engineering', 'Finance', 'Legal', 'Sales']
        },
    ])
    .then(data => {
        console.log(data);
    });
}
const showDepartments = () => {}
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: "Name of Department: ",
            name: 'department_name',
        },
    ])
    .then(data => {
        console.log(data);
    });
}




mainPrompt();
app.listen(PORT, () => console.log(`Now listening to PORT: ${PORT}`));