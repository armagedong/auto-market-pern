import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Photo = sequelize.define('Photo', {
    url: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.INTEGER, defaultValue: 0 }
});

export default Photo;
