import { Router } from 'express';
// Импортируем наш Фасад
import AuthService from '../services/AuthService.js';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

/**
 * @summary Роут регистрации.
 * @route POST /api/auth/register
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Логика вынесена в сервис
        const { token, user } = await AuthService.register(username, email, password);
        // Возвращаем токен и пользователя
        res.json({ message: 'Успешная регистрация', token, user });
    } catch (err) {
        // Улучшенная обработка ошибок из сервиса
        res.status(400).json({ error: err.message });
    }
});

/**
 * @summary Роут входа.
 * @route POST /api/auth/login
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Логика вынесена в сервис
        const { token, user } = await AuthService.login(email, password);
        res.json({ token, user });
    } catch (err) {
        // Улучшенная обработка ошибок из сервиса
        res.status(401).json({ error: err.message });
    }
});

export default router;