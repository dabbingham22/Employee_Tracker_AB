//Class for running db queries
import { pool } from "./connection.js";

export default class Db {
    constructor() {}

    async query(sql: string, args: any[] = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(sql, args);
            return result;
        } finally {
            client.release();
        }
    }
//class for query to find all employee
    findAllEmployees() {
        const sql = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
        return this.query(sql);
    }
    //class for query to add an employee
    addEmployee(employee: any) {
        const {first_name, last_name, role_id, manager_id} = employee;
        return this.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
            [first_name, last_name, role_id, manager_id]
        );
    }
    //class for query to view all roles
    findAllRoles() {
        return this.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
    }

    //class for query to remove an employee
    removeEmployee(employeeId: any) {
        const sql = "DELETE FROM employee WHERE id = $1";
        return this.query(sql, [employeeId]);
    }

    //class for query to add a role
    addRole(role: any) {
        const {role_title, salary, department_id} = role;
        return this.query("INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
            [role_title, salary, department_id]
        );
    }

    //class for query to remove a role
    removeRole(roleId: any) {
        const sql = "DELETE FROM role WHERE id =$1";
        return this.query(sql, [roleId])
    }

    //class for query to find all the department 
    findAllDepartments() {
        return this.query("SELECT department.name, department.id FROM department;" 
        );
        
    }

    //class for query to add the department 
    addDepartment(department: any) {
        const { department_name } = department;
        return this.query("INSERT INTO department(name) VALUES ($1)", 
            [department_name]
        );
        
    }
    //class for query to remove the department 
    removeDepartment(departmentId: any) {
        console.log('this is remove department', departmentId);
        const sql = "DELETE FROM department WHERE id =$1";
        return this.query(sql, [departmentId])
    };
}