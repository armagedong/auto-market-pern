import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import adsRoutes from './routes/ads.js';
import brandsRoutes from './routes/brands.js';
import colorsRoutes from './routes/colors.js';
import modelsRoutes from './routes/models.js';
import favoritesRoutes from "./routes/favorites.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(projectRoot, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/brands', brandsRoutes);
app.use('/api/colors', colorsRoutes);
app.use('/api/models', modelsRoutes);
app.use('/api/favorites', favoritesRoutes);

export default app;