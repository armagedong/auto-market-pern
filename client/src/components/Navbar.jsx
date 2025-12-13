import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-800 shadow-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Логотип */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-extrabold text-blue-500 tracking-wider">
                            AUTO<span className="text-white">SITE</span>
                        </Link>
                    </div>

                    {/* Навигация */}
                    <div className="flex items-center space-x-4">

                        {user ? (
                            <>
                                {/* Кнопка "Создать объявление" - выделяем её */}
                                <Link
                                    to="/create"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold transition duration-200 shadow-md hover:shadow-lg"
                                >
                                    + Объявление
                                </Link>

                                {/* Профиль и Выход */}
                                <span className="text-gray-400 text-sm hidden md:inline">
                                    {user.username}
                                </span>
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