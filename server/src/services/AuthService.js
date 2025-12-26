import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @summary AuthService - Фасад для обработки логики аутентификации и регистрации.
 * Соответствует принципу Single Responsibility Principle (SRP).
 */
class AuthService {
    /**
     * @summary Регистрирует нового пользователя.
     * @param {string} username - Имя пользователя.
     * @param {string} email - Email пользователя.
     * @param {string} password - Пароль (будет хеширован).
     * @returns {Promise<{token: string, user: User}>} JWT токен и объект пользователя.
     */
    async register(username, email, password) {
        if (!username || !email || !password) {
            throw new Error('Все поля обязательны.');
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует.');
        }

        const hash = await bcrypt.hash(password, 10);

        const user = await User.create({ username, email, password: hash, role: 'user' });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return { token, user };
    }

    /**
     * @summary Аутентифицирует пользователя.
     * @param {string} email - Email пользователя.
     * @param {string} password - Пароль.
     * @returns {Promise<{token: string, user: User}>} JWT токен и объект пользователя.
     */
    async login(email, password) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new Error('Пользователь не найден.');
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new Error('Неверный пароль.');
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return { token, user };
    }
}

export default new AuthService();