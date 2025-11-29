const app = require('./app');
const sequelize = require('./db');

const User = require('./models/User');
const Ad = require('./models/Ad');
const Photo = require('./models/Photo');

require('dotenv').config();

(async () => {
    try {
        await sequelize.authenticate();
        console.log('База данных подюченна');

        await sequelize.sync({ alter: true });
        console.log('Таблицы синхронизированы');

        app.listen(process.env.PORT, () => {
            console.log(`Сервер запущен: http://localhost:${process.env.PORT}`);
        });

    } catch (err) {
        console.error('Ошибка подключения', err);
    }
})();
