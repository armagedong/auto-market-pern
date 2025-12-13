import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @summary Проверяет наличие и валидность JWT токена в заголовке Authorization.
 * @param {object} req - Объект запроса Express.
 * @param {object} res - Объект ответа Express.
 * @param {function} next - Функция перехода к следующему middleware.
 * @returns {void} Устанавливает req.user и вызывает next() или возвращает 401.
 */
export default function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Нет токена' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Неверный токен' });
    }
}