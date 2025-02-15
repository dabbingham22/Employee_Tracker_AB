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
}
