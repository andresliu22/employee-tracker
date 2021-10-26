const express = require('express');
const routes = require('./routes/index.js');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const db = require('./config/connection');
const { exit } = require('process');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

var departments;
var roles;
var employees;

const mainPrompt = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: "What would you like to do?",
            name: "choice",
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role',
             'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit']
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
            case 'Quit':
                exit();
                break;
            default:
                console.log('Error, not a given choice!');
        }
    })
}

const showEmployees = () => {
    const departmentQuery = 'SELECT a.id, a.title, a.salary, b.name FROM role AS a JOIN department AS b ON a.department_id = b.id';
    const roleQuery = `SELECT a.id, a.first_name, a.last_name, manager_id, b.title as role, b.salary, b.name as department FROM employee as a JOIN (${departmentQuery}) as b ON a.role_id = b.id`;
    const employeeQuery = `SELECT a.id, a.first_name, a.last_name, a.role, a.salary, a.department, b.first_name as manager FROM (${roleQuery}) as a JOIN employee as b ON a.manager_id = b.id`;
    const employeeQuery2 = `SELECT a.id, a.first_name, a.last_name, a.role, a.salary, a.department, NULL as manager FROM (${roleQuery}) as a WHERE a.manager_id is NULL`
    
    db.query(`${employeeQuery} UNION ${employeeQuery2} order by id;`, function(error, resolves) {
        if (error) {
            return console.log(error);
        } else {
            console.log(consoleTable.getTable(resolves));
        }
        mainPrompt();
    });
}
const addEmployee = () => {

    const inquirerEmployees = [];
    const inquirerRoles = [];
    
    employees.forEach(employee => {
        inquirerEmployees.push(employee.first_name + " " + employee.last_name);
    })

    roles.forEach(role => {
        inquirerRoles.push(role.title);
    });

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
            choices: [...inquirerRoles]
        },
        {
            type: 'list',
            message: "Manager in charge: ",
            name: 'manager',
            choices: [...inquirerEmployees, 'No Manager']
        },
    ])
    .then(data => {
        let roleId;
        let managerId;

        roles.forEach(role => {
            if (role.title.toUpperCase() === data.role.toUpperCase()) {
                roleId = parseInt(role.id);
            }
        })

        if (data.manager !== "No Manager") {
            employees.forEach(employee => {
                if (`${employee.first_name.toUpperCase()} ${employee.last_name.toUpperCase()}` === data.manager.toUpperCase()) {
                    managerId = parseInt(employee.id);
                }
            })
        } else {
            managerId = null;
        }
        

        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${data.first_name}", "${data.last_name}", ${roleId}, ${managerId});`, function (error, resolve){
            error ? console.log(error) : console.log("Employee Added");
            getEmployees();
            mainPrompt();
        });
        
    });
}
const updateEmployee = () => {

    const inquirerEmployees = [];
    const inquirerRoles = [];
    
    employees.forEach(employee => {
        inquirerEmployees.push(employee.first_name + " " + employee.last_name);
    })

    roles.forEach(role => {
        inquirerRoles.push(role.title);
    });

    inquirer.prompt([
        {
            type: 'list',
            message: "Employee's role you want to update: ",
            name: 'name',
            choices: [...inquirerEmployees]
        },
        {
            type: 'list',
            message: "Role you want to assign to the employee: ",
            name: 'role',
            choices: [...inquirerRoles]
        },
    ])
    .then(data => {
        let employeeId;
        let roleId;

        employees.forEach(employee => {
            if (`${employee.first_name.toUpperCase()} ${employee.last_name.toUpperCase()}` === data.name.toUpperCase()) {
                employeeId = parseInt(employee.id);
            }
        })

        roles.forEach(role => {
            if (role.title.toUpperCase() === data.role.toUpperCase()) {
                roleId = parseInt(role.id);
            }
        })

        db.query(`UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId};`, function(error, resolve) {
            error ? console.log(error) : console.log("Employee Updated!");
            getEmployees();
            mainPrompt();
        })
    });
}
const showRoles = () => {
    db.query('SELECT a.id, a.title, a.salary, b.name FROM role AS a JOIN department AS b ON a.department_id = b.id;', function(error, resolves) {
        if (error) {
            return console.log(error);
        } else {
            console.log(consoleTable.getTable(resolves));
        }
        mainPrompt();
    });
}
const addRole = () => {
    
    const inquirerDepartments = [];
    
    departments.forEach(department => {
        inquirerDepartments.push(department.name);
    });

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
            choices: [...inquirerDepartments]
        },
    ])
    .then(data => {
        let departmentId;
        departments.forEach(department => {
            if (department.name.toUpperCase() === data.role_department.toUpperCase()) {
                departmentId = parseInt(department.id);
            }
        });

        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${data.role_name}", ${parseFloat(data.role_salary)}, ${parseInt(departmentId)});`, function (error, resolve){
            error ? console.log(error) : console.log("Role Added");
            getRoles();
            mainPrompt();
        });
        
    });
}
const showDepartments = () => {
    db.query('SELECT * FROM department;', function(error, resolves) {
        if (error) {
            return console.log(error);
        } else {
            console.log(consoleTable.getTable(resolves));
        }
        mainPrompt();
    });
}
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: "Name of Department: ",
            name: 'department_name',
        },
    ])
    .then(data => {
        db.query(`INSERT INTO department (name) VALUES ("${data.department_name}");`, function (error, resolve){
            error ? console.log(error) : console.log("Department Added");
            getDepartments();
            mainPrompt();
        });
    });
}

const getDepartments = () => {
    db.query('SELECT * FROM department;', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            departments = data;
        }
    })
}

const getRoles = () => {
    db.query('SELECT * FROM role;', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            roles = data;
        }
    })
}

const getEmployees = () => {
    db.query('SELECT * FROM employee;', function(error, data) {
        if (error) {
            console.log(error);
        } else {
            employees = data;
        }
    })
}

const getData = () => {
    getDepartments();
    getRoles();
    getEmployees();
}

getData();
mainPrompt();
app.listen(PORT, () => console.log(`Now listening to PORT: ${PORT}`));