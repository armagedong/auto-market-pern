

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const adsRoutes = require('./routes/ads');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// app.use('/api/auth', authRoutes);
// app.use('/api/ads', adsRoutes);

app.get('/', (req, res) => {
    res.send({ message: "бек заработал" });
});

module.exports = app;

