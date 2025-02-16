//Class for running db queries
import { pool } from "./connection.js";
export default class Db {
    constructor() { }
    async query(sql, args = []) {
        const client = await pool.connect();
        try {
            const result = await client.query(sql, args);
            return result;
        }
        finally {
            client.release();
        }
    }
    findAllEmployees() {
        const sql = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT (manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
        return this.query(sql);
    }
    addEmployee(employee) {
        const { first_name, last_name, role_id, manager_id } = employee;
        return this.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)", [first_name, last_name, role_id, manager_id]);
    }
    findAllRoles() {
        return this.query("SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;");
    }
    removeEmployee(employeeId) {
        const sql = "DELETE FROM employee WHERE id = $1";
        return this.query(sql, [employeeId]);
    }
    addRole(role) {
        const { role_title, salary, department_id } = role;
        return this.query("INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)", [role_title, salary, department_id]);
    }
    removeRole(roleId) {
        const sql = "DELETE FROM role WHERE id =$1";
        return this.query(sql, [roleId]);
    }
    findAllDepartments() {
        return this.query("SELECT department.name FROM department;");
    }
    addDepartment(department) {
        const { department_name } = department;
        return this.query("INSERT INTO department(name) VALUES ($1)", [department_name]);
    }
    removeDepartment(departmentId) {
        const sql = "DELETE FROM department WHERE id =$1";
        return this.query(sql, [departmentId]);
    }
    ;
}
