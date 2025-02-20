import inquirer from "inquirer";
import Db from "./db/index.js";

const db = new Db();

initialPrompts();

function initialPrompts() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          {
            name: "View all employees",
            value: "VIEW_EMPLOYEES",
          },
          {
            name: "Add Employee",
            value: "ADD_EMPLOYEE",
          },
          {
            name: "Remove Employee",
            value: "REMOVE_EMPLOYEE",
          },
          {
            name: "Update Employee Role",
            value: "UPDATE_EMPLOYEE_ROLE",
          },
          {
            name: "View All Roles",
            value: "VIEW_ROLES",
          },
          {
            name: "Add Role",
            value: "ADD_ROLE",
          },
          {
            name: "Remove Role",
            value: "REMOVE_ROLE",
          },
          {
            name: "View All Departments",
            value: "VIEW_DEPARTMENTS",
          },
          {
            name: "Add Department",
            value: "ADD_DEPARTMENTS",
          },

          {
            name: "Remove Department",
            value: "REMOVE_DEPARTMENT",
          },
          {
            name: "Quit",
            value: "QUIT",
          },
        ],
      },
    ])
    .then((res) => {
      const choice = res.choice;
      console.log("choice", choice);
      switch (choice) {
        case "VIEW_EMPLOYEES":
          viewEmployeees();
          break;
        case "ADD_EMPLOYEE":
          addEmployee();
          break;
        case "REMOVE_EMPLOYEE":
          removeEmployee();
          break;
        case "VIEW_ROLES":
          viewRoles();
          break;
        case "ADD_ROLE":
          addRole();
          break;
        case "REMOVE_ROLE":
          removeRole();
          break;
        case "VIEW_DEPARTMENTS":
          viewDepartments();
          break;
        case "ADD_DEPARTMENTS":
          addDepartment();
          break;
        case "REMOVE_DEPARTMENT":
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
  inquirer
    .prompt([
      {
        name: "first_name",
        message: "What is the employee's first_name",
      },
      {
        name: "last_name",
        message: "What is the employee's last_name",
      },
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
          };
        });
        inquirer
          .prompt([
            {
              type: "list",
              name: "roleId",
              message: "What is the employees role?",
              choices: roleChoices,
            },
          ])
          .then((res) => {
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
              managerChoices.unshift({ name: "None", value: null });

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "managerId",
                    message: "Who is the employees manager?",
                    choices: managerChoices,
                  },
                ])
                .then((res) => {
                  const employee = {
                    first_name: firstName,
                    last_name: lastName,
                    manager_id: res.managerId,
                    role_id: roleId,
                  };

                  db.addEmployee(employee);
                })
                .then(() => {
                  console.log(`Added ${firstName} ${lastName} to the database`);
                })
                .then(() => {
                  initialPrompts();
                });
            });
          });
      });
    });
}
function removeEmployee() {
  // find all the employees
  db.findAllEmployees()
    .then(({ rows }) => {
      const employees = rows.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
      // create the view to select the employees
      // create a new prompt to choose which employee to remove
      return inquirer.prompt([
        {
          type: "list",
          name: "employeeId",
          message: "Which employee do you want to remove?",
          choices: employees,
        },
      ]);
    })
    // then run the removeEmployee method
    .then(({ employeeId }) => {
      return db.removeEmployee(employeeId).then(() => {
        console.log("Employee removed successfully.");
        initialPrompts();
      });
    })
    .catch((err) => console.error("Error removing employee:", err));
}
function viewRoles() {
  db.findAllRoles()
    .then(({ rows }) => {
      const roles = rows.map((role) => role.title);
      console.log("Available Roles:", roles);
      initialPrompts();
    })
    .catch((error) => {
      console.error("Error fetching roles:", error);
    });
}
function addRole() {
  inquirer
    .prompt([
      {
        name: "role_title",
        message: "What is the name of the role?",
      },
      {
        name: "salary",
        message: "What is the salary for this role?",
        validate: (input) =>
          isNaN(input) ? "Please enter a valid number" : true,
      },
      {
        name: "department_id",
        message: "Enter the department ID for this role:",
        validate: (input) =>
          isNaN(input) ? "Please enter a valid department ID" : true,
      },
    ])
    .then((res) => {
      const { role_title, salary, department_id } = res;

      return db.addRole({ role_title, salary, department_id });
    })
    .then(() => {
      console.log("New role added successfully!");
      initialPrompts();
    })
    .catch((error) => {
      console.error("Error adding role:", error);
    });
}
function removeRole() {
  db.findAllRoles()
    .then(({ rows }) => {
      const roles = rows.map((role) => ({
        name: role.title,
        value: role.id,
      }));

      return inquirer.prompt([
        {
          type: "list",
          name: "roleId",
          message: "Which role would you like to remove?",
          choices: roles,
        },
      ]);
    })
    .then((res) => {
      const { roleId } = res;
      return db.removeRole(roleId);
    })
    .then(() => {
      console.log("Role removed successfully!");
      initialPrompts();
    })
    .catch((error) => {
      console.error("Error removing role:", error);
    });
}
function viewDepartments() {
  db.findAllDepartments()
    .then(({ rows }) => {
      const departments = rows.map((department) => department.name);
      console.log("Available Departments:", departments);
      initialPrompts();
    })
    .catch((error) => {
      console.error("Error retrieving departments:", error);
    });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department_name",
        message: "What is the name of the new department?",
        validate: (input) =>
          input ? true : "Department name cannot be empty.",
      },
    ])
    .then((res) => {
      const department_name = res.department_name;

      return db.addDepartment({ department_name });
    })
    .then(() => {
      console.log("Department added successfully!");
      initialPrompts();
    })
    .catch((error) => {
      console.error("error adding department:", error);
      initialPrompts();
    });
}
function removeDepartment() {
  db.findAllDepartments().then(({ rows }) => {
    const departments = rows.map((department) => ({
      name: department.name,
      value: department.id,
    }));
    console.log("Available Departments:", departments);

    return inquirer
      .prompt([
        {
          type: "list",
          name: "departmentId",
          message: "Which department would you like to remove?",
          choices: departments,
        },
      ])
      .then((res) => {
        const { departmentId } = res;
        return db.removeDepartment(departmentId);
      })
      .then(() => {
        console.log("Department removed successfully!");
        initialPrompts();
      })
      .catch((error) => {
        console.error("Error removing department:", error);
      });
  });
}
function quit() {}
