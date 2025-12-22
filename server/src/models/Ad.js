import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './User.js';
import Photo from './Photo.js';
import Brand from './Brand.js';
import Model from './Model.js';
import Color from './Color.js';
import Generation from './Generation.js';

/**
 * @summary Модель объявления.
 * @class Ad
 */
const Ad = sequelize.define('Ad', {
    title: { type: DataTypes.STRING, allowNull: false },
    year: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    brandId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Brand, key: 'id' }},
    modelId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Model, key: 'id' }},
    generationId: { type: DataTypes.INTEGER, allowNull: true, references: { model: Generation, key: 'id' }},
    colorId: { type: DataTypes.INTEGER, allowNull: false, references: { model: Color, key: 'id' }},
    mileage: DataTypes.INTEGER,
    fuel: DataTypes.STRING,
    gearbox: DataTypes.STRING,
    vin: DataTypes.STRING,
    state: DataTypes.STRING, // <-- Унифицировано: техническое состояние авто (good, bad)
    ptsNumber: DataTypes.STRING(10), // <-- Унифицировано: номер ПТС
    ptsSeries: DataTypes.STRING(4), // <-- Добавлено: серия ПТС
    ptsOwners: DataTypes.INTEGER, // <-- Унифицировано: число владельцев по ПТС
    registered: DataTypes.BOOLEAN,
    description: DataTypes.TEXT,
    address: DataTypes.STRING,
    contact: DataTypes.STRING,
    options: DataTypes.TEXT, // <-- Для хранения JSON строки доп. опций
    status: { type: DataTypes.STRING, defaultValue: 'pending' } // pending, approved
});

// Настройка связей с явными алиасами
Ad.belongsTo(User, { foreignKey: 'userId' });
Ad.belongsTo(Brand, { foreignKey: 'brandId' });
Ad.belongsTo(Generation, { foreignKey: 'generationId' });
Ad.belongsTo(Model, { foreignKey: 'modelId' });
Ad.belongsTo(Color, { foreignKey: 'colorId' });

// Указываем алиас 'Photos' для удобства в Sequelize Include
Ad.hasMany(Photo, { foreignKey: 'adId', as: 'Photos' });

export default Ad;