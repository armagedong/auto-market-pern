import { Router } from 'express';
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
        const { token, user } = await AuthService.register(username, email, password);
        res.json({ message: 'Успешная регистрация', token, user });
    } catch (err) {
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
        const { token, user } = await AuthService.login(email, password);
        res.json({ token, user });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
});

export default router;