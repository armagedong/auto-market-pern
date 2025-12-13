import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

/**
 * @summary Модель пользователя.
 * @class User
 */
const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true }, // <-- Унифицировано с фронтендом
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }, // Хешированный пароль
    role: { type: DataTypes.STRING, defaultValue: 'user' } // user, moderator, admin
}, {
    tableName: 'users',
    timestamps: true
});

export default User;