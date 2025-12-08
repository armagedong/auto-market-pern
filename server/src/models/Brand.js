import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Brand = sequelize.define('Brand', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Brands'
});

export default Brand;
