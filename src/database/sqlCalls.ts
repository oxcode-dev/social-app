

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
    return await db.all(
        `SELECT * FROM ${tableName} WHERE ${condition}`
    );
}