// server/src/models/Generation.js

import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import Model from './Model.js'; // Импортируем Model

const Generation = sequelize.define('Generation', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'Название поколения, например: F15, W212 или I'
    },
    yearFrom: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Год начала выпуска'
    },
    yearTo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Год окончания выпуска'
    },
}, {
    tableName: 'Generations'
});

// Связь: Поколение принадлежит Модели
Generation.belongsTo(Model, { foreignKey: 'modelId' });
Model.hasMany(Generation, { foreignKey: 'modelId' });

export default Generation;