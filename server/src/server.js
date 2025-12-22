import app from './app.js';
import sequelize from './db.js';
import dotenv from 'dotenv';

import './models/User.js';
import './models/Ad.js';
import './models/Photo.js';
import './models/Brand.js';

dotenv.config();

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('База данных подключена');

        await sequelize.sync({ alter: true });
        console.log('Таблицы синхронизированы');

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));


    } catch (err) {
        console.error('Ошибка подключения:', err);
    }
};

startServer();
