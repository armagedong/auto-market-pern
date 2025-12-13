import React, { useState } from 'react';
import API, { setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function Login({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });

            localStorage.setItem('token', res.data.token);
            setAuthToken(res.data.token);

            setUser(res.data.user);
            navigate('/');

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4">
            <div className="bg-gray-800 p-8 md:p-10 rounded-xl w-full max-w-sm shadow-2xl border border-gray-700">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Вход в AutoSite</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <input
                            type="password"
                            placeholder="Пароль"
                            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold text-lg transition duration-200"
                    >
                        Войти
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-6">
                    Нет аккаунта?
                    <Link to="/register" className="text-blue-500 hover:text-blue-400 ml-1 font-medium">
                        Зарегистрироваться
                    </Link>
                </p>
            </div>
        </div>
    );
}