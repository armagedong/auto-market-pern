import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const developer = () => {
        alert("Кантурлеев Арман 4пк1")
    }

    return (
        <nav className="bg-gray-800 shadow-xl sticky top-0 z-50 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип */}
                    <div className="flex-shrink-0 flex items-center gap-4">
                        <Link to="/" className="text-2xl font-extrabold text-blue-500 tracking-wider">
                            AUTO<span className="text-white">SITE</span>
                        </Link>
                        <button
                            className="text-gray-400 hover:text-white px-3 py-1 border border-gray-700 rounded-lg text-[10px] uppercase font-bold tracking-tighter transition duration-150"
                            onClick={developer}
                        >
                            Разработчик
                        </button>
                    </div>

                    {/* Навигация */}
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                        >
                            Главная
                        </Link>

                        {user ? (
                            <>
                                {/* КНОПКА АДМИН ПАНЕЛИ (видна только админу) */}
                                {user.role === 'admin' && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-1 text-orange-400 hover:bg-orange-400/10 px-3 py-2 rounded-md text-sm font-bold transition duration-150 border border-orange-400/20"
                                    >
                                        <span className="text-base">⚙️</span>
                                        <span className="hidden sm:inline">Админ</span>
                                    </Link>
                                )}

                                {/* Ссылка на Профиль */}
                                <Link
                                    to="/profile"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                                >
                                    Профиль
                                </Link>

                                {/* Кнопка "Создать объявление" */}
                                <Link
                                    to="/create"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold transition duration-200 shadow-md hover:shadow-lg active:scale-95"
                                >
                                    + Объявление
                                </Link>

                                {/* Кнопка Выход */}
                                <button
                                    onClick={handleLogout}
                                    className="text-red-400 hover:text-red-300 px-3 py-2 text-sm font-medium transition duration-150"
                                >
                                    Выход
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                                >
                                    Вход
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-bold transition duration-200"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;