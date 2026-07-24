import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbInstance: Database | null = null;

export async function getDatabaseConnection(): Promise<Database> {
    if (dbInstance) {
        return dbInstance;
    }

    // Opens the SQLite file (creates it automatically if it does not exist)
    dbInstance = await open({
        filename: './database.sqlite3',
        driver: sqlite3.Database
    });

    // Create a sample table
    await dbInstance.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    `);

    console.log('📦 SQLite database connected and initialized.');

    return dbInstance;
}
