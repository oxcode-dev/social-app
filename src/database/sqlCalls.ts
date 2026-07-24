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


