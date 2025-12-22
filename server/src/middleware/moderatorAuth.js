// server/middleware/moderatorAuth.js

export const moderatorAuth = (req, res, next) => {
    // req.user должен быть заполнен вашим protect middleware (проверка JWT)
    if (!req.user || req.user.role !== 'moderator') {
        return res.status(403).json({
            error: 'Доступ запрещен. Требуется роль модератора.'
        });
    }
    next();
};