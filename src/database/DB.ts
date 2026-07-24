import { getDatabaseConnection } from "../config/database.ts";


export class DB {
    protected db;

    constructor() {
        this.db = this.connect();
    }

    protected async connect() {
        return await getDatabaseConnection();
        // const cars = await db.all('SELECT * FROM cars');
    }

    async getAllData<T = any>(tableName: string): Promise<T[]> {
        return (await this.db).all(`SELECT * FROM ${tableName}`);
    }

    async getAllDataOrder<T = any>(
        tableName: string,
        order: string
    ): Promise<T[]> {
        const db = await getDatabaseConnection();
        return await db.all(
            `SELECT * FROM ${tableName} ORDER BY ${order}`
        );
    }

    async getTotalData(tableName: string): Promise<number> {
        const result: any = await (await this.db).all(
            `SELECT COUNT(*) as total FROM ${tableName}`
        );
        return result[0].total;
    }

    async getAllDataWhere<T = any>(
        tableName: string,
        condition: string | number
    ): Promise<T[]> {
        return (await this.db).all(
            `SELECT * FROM ${tableName} WHERE ${condition}`
        );
    }

    async getAllDataInnerJoin<T = any>(
        tableName: string,
        otherTable: string,
        condition: string
    ): Promise<T[]> {
        return (await this.db).all(
            `SELECT * FROM ${tableName} JOIN ${otherTable} ON ${condition}`
        );
    }

    async getPaginatedArticles<T = any>(
        tableName: string,
        order: string,
        start: number,
        perPage: number
    ): Promise<T[]> {
        return (await this.db).all(
            `SELECT * FROM ${tableName} ORDER BY ${order} LIMIT ${start}, ${perPage}`
        );
    }

    async getSumData(
        tableName: string,
        column: string
    ): Promise<number> {
        const result: any = await (await this.db).all(
            `SELECT SUM(${column}) as total FROM ${tableName}`
        );

        return result[0].total;
    }

    async addData(
        tableName: string,
        data: Record<string, any>
    ): Promise<any> {
        const fields = Object.keys(data);
        const values = fields.map(field => `:${field}`);

        const sql = `
            INSERT INTO ${tableName}
            (${fields.join(",")})
            VALUES (${values.join(",")})
        `;

        return (await this.db).run(sql, data);
    }

    async updateData(
        tableName: string,
        condition: string,
        key: string
    ): Promise<any> {
        return (await this.db).run(
            `UPDATE ${tableName} SET ${condition} WHERE ${key}`
        );
    }

    async deleteData(
        tableName: string,
        key: string
    ): Promise<any> {
        return (await this.db).run(
            `DELETE FROM ${tableName} WHERE ${key}`
        );
    }
}
