import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decoded = jwtDecode(token);

        // Проверяем роль (убедись, что твой бэкенд кладет 'role' в JWT токен)
        if (adminOnly && decoded.role !== 'admin') {
            return (
                <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-white">
                    <div className="text-center">
                        <h1 className="text-6xl font-black text-red-500 mb-4">403</h1>
                        <p className="text-xl font-bold">Доступ запрещен: недостаточно прав</p>
                        <a href="/" className="mt-6 inline-block text-blue-500 underline">Вернуться на главную</a>
                    </div>
                </div>
            );
        }

        return children;
    } catch (error) {
        return <Navigate to="/login" replace />;
    }
}