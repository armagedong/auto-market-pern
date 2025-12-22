import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import adsRoutes from './routes/ads.js';
import brandsRoutes from './routes/brands.js';
import colorsRoutes from './routes/colors.js';
import modelsRoutes from './routes/models.js';
import favoritesRoutes from './routes/favorites.js';
import generationRoutes from './routes/generations.js'
import path from 'path';
import { fileURLToPath } from 'url';
import moderationRoutes from "./routes/moderationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const app = express();



app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/colors', colorsRoutes);
app.use('/api/models', modelsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/generations', generationRoutes);
app.use('/api/moderation', moderationRoutes);


export default app;