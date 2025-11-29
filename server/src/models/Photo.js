const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Ad = require('./Ad');

const Photo = sequelize.define('Photo', {
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

Photo.belongsTo(Ad, { foreignKey: 'ad_id' });
Ad.hasMany(Photo, { foreignKey: 'ad_id' });

module.exports = Photo;
