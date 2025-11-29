const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Ad = sequelize.define('Ad', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: false
    },
    model: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.INTEGER
    },
    price: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    mileage: {
        type: DataTypes.INTEGER
    },
    fuel: {
        type: DataTypes.STRING
    },
    gearbox: {
        type: DataTypes.STRING
    },
    color: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    vin: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    moderator_comment: {
        type: DataTypes.TEXT
    },
    photos: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
    }
});

Ad.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Ad, { foreignKey: 'user_id' });

module.exports = Ad;
