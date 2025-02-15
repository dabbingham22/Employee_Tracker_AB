import inquirer from "inquirer";
//import Db from './db/index.js';

//const db = new Db();

initialPrompts();

function initialPrompts() {
    inquirer.prompt ([
        {
            type: 'list',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                {
                    name: 'View all employees',
                    value: 'VIEW_EMPLOYEES',
                },
                {
                    name: 'Add Employee',
                    value: 'ADD_EMPLOYEE',
                },
                {
                    name: 'Remove Employee',
                    value: 'REMOVE_EMPLOYEE',
                },
                {
                    name: 'Update Employee Role',
                    value: 'UPDATE_EMPLOYEE_ROLE',
                },
                {
                    name: 'View All Roles',
                    value: 'VIEW_ROLES',
                },
                {
                    name: 'Add Role',
                    value: 'ADD_ROLE',
                },
                {
                    name: 'Remove Role',
                    value: 'REMOVE_ROLE',
                },
                {
                    name: 'View All Departments',
                    value: 'VIEW_ALL_DEPARTMENTS',
                },
                {
                    name: 'Add Department',
                    value: 'ADD_DEPARTMENT',
                },

                {
                    name: 'Remove Department',
                    value: 'REMOVE_DEPARTMENT',
                },
                {
                    name: 'Quit',
                    value: 'QUIT',
                },
            ]
        }
    ]).then((res) => {
        const choice = res.choice;
        console.log('choice', choice);
    });
}