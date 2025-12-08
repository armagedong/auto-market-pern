import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Brand from './Brand.js';

const Model = sequelize.define('Model', {
    name: { type: DataTypes.STRING, allowNull: false },
});

Model.belongsTo(Brand, { foreignKey: 'brandId' });

export default Model;
