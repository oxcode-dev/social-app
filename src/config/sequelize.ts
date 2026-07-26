import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './src/database/database.sqlite3', // File location for your SQLite DB
  logging: false,               // Set to console.log to see raw SQL queries
});


export const startSequelize = async () => {
    try {
        await sequelize.sync({ alter: true });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default sequelize;