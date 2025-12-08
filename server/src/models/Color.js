import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Color = sequelize.define('Color', {
    name: { type: DataTypes.STRING, allowNull: false }
});

export default Color;
