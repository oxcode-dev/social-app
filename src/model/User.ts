import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/sequelize.ts';

// Define the attributes matching your database table
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  username: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

// Extend the Sequelize Model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: string;
    public name!: string;
    public email!: string;
    public username!: string;

    // Timestamps automatically provided by Sequelize
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        tableName: 'users',
    }
);

export default User;
