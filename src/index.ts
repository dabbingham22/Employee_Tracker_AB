import inquirer from "inquirer";
import Db from './db/index.js';

const db = new Db();

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
        switch (choice) {
            case 'VIEW_EMPLOYEES':
                viewEmployeees();
                break;
            case 'ADD_EMPLOYEE':
                addEmployee();
                break;
            case 'REMOVE_EMPLOYEE':
                removeEmployee();
                break;
            case 'VIEW_ROLES':
                viewRoles();
                break;
            case 'ADD_ROLE':
                addRole();
                break;
            case 'REMOVE_ROLE':
                removeRole();
                break;
            case 'VIEW_DEPARTMENTS':
                viewDepartments();
                break;
            case 'ADD_DEPARTMENTS':
                addDepartments();
                break;
            case 'REMOVE_DEPARTMENT':
                removeDepartment();
                break;
            default:
                quit();
                break;
        }
    });
}

function viewEmployeees() {
    db.findAllEmployees()
    .then(({ rows }) => {
        const employees = rows;
        console.table(employees);
    })
    .then(() => initialPrompts());
}
function addEmployee() {
    inquirer.prompt ([ 
        {
            name: 'first_name',
            message: 'What is the employee\'s first_name',
        },
        {
            name: 'last_name',
            message: 'What is the employee\'s last_name',
        }
    ])
    .then((res) => {
        const firstName = res.first_name;
        const lastName = res.last_name;

        db.findAllRoles().then((response) => {
            const roles = response?.rows;
            const roleChoices = roles?.map((role) => {
                const id = role.id;
                const title = role.title;
                return {
                    name: title,
                    value: id,
                }
            });
            inquirer.prompt([
                {
                type: 'list',
                name: 'roleId',
                message: 'What is the employee\s role?',
                choices: roleChoices
                }
            ]).then((res) => {
                const roleId = res.roleId;

                db.findAllEmployees().then((res) => {
                    const employees = res?.rows;
                    const managerChoices = employees?.map((employee) => {
                        const id = employee.id;
                        const firstName = employee.first_name;
                        const lastName = employee.last_name;
                        return {
                            name: `${firstName} ${lastName}`,
                            value: id,
                        };
                    });
                    managerChoices.unshift({name: "None", value: null});

                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'managerId',
                            message: 'Who is the employees manager?',
                            choices: managerChoices,
                        }
                    ])
                    .then((res) => {
                        const employee = {
                            first_name: firstName,
                            last_name: lastName,
                            manager_id: res.managerId,
                            role_id: roleId,
                        };
                        
                        db.addEmployee(employee);
                    }).then(() => {
                        console.log(`Added ${firstName} ${lastName} to the database`);
                    }).then(() => {
                        initialPrompts();
                    })
                });
            });
        });
    });
}
function removeEmployee() {
// find all the employees
db.findAllEmployees()
.then(({ rows }) => {
    const employees = rows.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
    }));
// create the view to select the employees
// create a new prompt to choose which employee to remove
return inquirer.prompt([
    {
        type: 'list',
        name: 'employeeId',
        message: 'Which employee do you want to remove?',
        choices: employees
    }
]);
})
// then run the removeEmployee method
.then(({ employeeId }) => {
    return db.removeEmployee(employeeId)
.then(() => {
console.log('Employee removed successfully.');
initialPrompts();
});
})
.catch(err => console.error("Error removing employee:", err)
);
}
function viewRoles() {

}
function addRole() {

}
function removeRole() {

}
function viewDepartments() {

}
function addDepartments() {

}
function removeDepartment() {

}
function quit() {

}