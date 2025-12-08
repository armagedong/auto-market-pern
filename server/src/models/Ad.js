import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './User.js';
import Photo from './Photo.js';
import Brand from './Brand.js';
import Model from './Model.js';
import Color from './Color.js';

const Ad = sequelize.define('Ad', {
    title: { type: DataTypes.STRING, allowNull: false },
    year: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    mileage: DataTypes.INTEGER,
    fuel: DataTypes.STRING,
    gearbox: DataTypes.STRING,
    vin: DataTypes.STRING,
    state: DataTypes.STRING, // битый / не битый
    ptsNumber: DataTypes.STRING,
    ptsOwners: DataTypes.INTEGER,
    registered: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    contact: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'pending' } // pending, approved
});

Ad.belongsTo(User, { foreignKey: 'userId' });
Ad.belongsTo(Brand, { foreignKey: 'brandId' });
Ad.belongsTo(Model, { foreignKey: 'modelId' });
Ad.belongsTo(Color, { foreignKey: 'colorId' });
Ad.hasMany(Photo, { foreignKey: 'adId' });

export default Ad;
