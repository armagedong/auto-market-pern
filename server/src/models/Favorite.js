
import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import User from './User.js';
import Ad from './Ad.js';

const Favorite = sequelize.define('Favorite', {

    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'id',
        },
    },
    adId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Ad,
            key: 'id',
        },
    },
}, {
    tableName: 'Favorites', // Имя таблицы в БД
    timestamps: true, // Добавляет createdAt и updatedAt
});

// Ассоциации (связи)
User.belongsToMany(Ad, { through: Favorite, foreignKey: 'userId', as: 'Favorites' });
Ad.belongsToMany(User, { through: Favorite, foreignKey: 'adId', as: 'Fans' });

// Также установим прямые связи для удобного include в запросах:
Favorite.belongsTo(User, { foreignKey: 'userId' });
Favorite.belongsTo(Ad, { foreignKey: 'adId' });

export default Favorite;