import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Установи: npm install jwt-decode

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');

    // 1. Если токена нет вообще — на страницу входа
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);

        // 2. Проверяем срок действия токена (exp в секундах)
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }

        // 3. Если нужен админ, а в токене роль другая — на главную
        if (adminOnly && decoded.role !== 'admin') {
            return <Navigate to="/" replace />;
        }

        // Если все проверки пройдены — показываем страницу
        return children;

    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;