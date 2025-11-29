const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const adsRoutes = require('./routes/ads');

const app = express();

app.use(cors());
app.use(express.json()); // <--- обязательно!
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/ads', adsRoutes);

app.get('/', (req, res) => {
    res.send({ message: 'бек запущен' });
});

module.exports = app;
