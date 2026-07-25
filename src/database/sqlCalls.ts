import { getDatabaseConnection } from "../config/database.ts";

export const getAllData = async(tableName: string) => {
    const db = await getDatabaseConnection();
    return await db.all('SELECT * FROM cars');
}

export const getAllDataWhere = async (
    tableName: string,
    condition: string | number
) => {
    const db = await getDatabaseConnection();
    const result = await db.all(
        `SELECT * FROM ${tableName} WHERE ${condition}`
    );
    return result.length > 0 ? result[0] : {};
}

export const getAllDataOrder = async(tableName: string, order: string) => {
    const db = await getDatabaseConnection();
    return await db.all(
        `SELECT * FROM ${tableName} ORDER BY ${order}`
    );
}

export const getTotalData = async (tableName: string) => {
    const db = await getDatabaseConnection();
    const result = await db.all(
        `SELECT COUNT(*) as total FROM ${tableName}`
    );
    return result[0].total
}

export const getAllDataInnerJoin = async(tableName: string, otherTable: string, condition: string) => {
    const db = await getDatabaseConnection();
    return await db.all(
        `SELECT * FROM ${tableName} JOIN ${otherTable} ON ${condition}`
    );
}

export const getPaginatedArticles = async (tableName: string, order: string, start: string, perPage: number) => {
    const db = await getDatabaseConnection();
    return await db.all(
        `SELECT * FROM ${tableName} ORDER BY ${order} LIMIT ${start}, ${perPage}`
    )
} 

export const getSumData = async (
    tableName: string,
    column: string
) => {
    const db = await getDatabaseConnection();
    const result = await db.all(
        `SELECT SUM(${column}) as total FROM ${tableName}`
    );
    return result[0].total;
}

export const addData = async (
    tableName: string,
    data: Record<string, any>
) => {
    const db = await getDatabaseConnection();
    const fields = Object.keys(data);
    const values = fields.map(field => `:${field}`);

    const sql = `
        INSERT INTO ${tableName}
        (${fields.join(",")})
        VALUES (${values.join(",")})
    `;

    return await db.run(sql, data)
}

export const updateData = async(
    tableName: string,
    condition: string,
    key: string
) => {
    const db = await getDatabaseConnection();
    return db.run(
        `UPDATE ${tableName} SET ${condition} WHERE ${key}`
    );
}

export const deleteData = async (tableName: string, key: string) => {
    const db = await getDatabaseConnection();
    return await db.run(
        `DELETE FROM ${tableName} WHERE ${key}`
    );
}
