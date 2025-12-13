import React, { useState } from 'react';
import API, { setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom'; // <-- Добавлен импорт

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // <-- Инициализация хука

    /**
     * @summary Обрабатывает отправку формы входа.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });

            // Сохраняем и устанавливаем токен
            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);

            setUser(res.data.user);
            alert('Вы успешно вошли!');

            // <-- САМЫЙ ВАЖНЫЙ КОД: Перенаправление на главную страницу
            navigate('/');

        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || 'Ошибка входа');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <form
                className="bg-gray-800 p-10 rounded-xl w-96 shadow-lg"
                onSubmit={handleSubmit}
            >
                <h1 className="text-2xl font-bold text-white mb-6">Вход</h1>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded mb-4 bg-gray-700 text-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    className="w-full p-3 rounded mb-6 bg-gray-700 text-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full p-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold"
                >
                    Войти
                </button>
            </form>
        </div>
    );
}