import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="font-bold text-xl text-blue-600 hover:text-blue-700 transition-colors">CarMarket</Link>
        <div className="flex items-center space-x-4">
            {user ? (
                <>
                    <Link to="/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">+ Добавить авто</Link>
                    <span className="text-gray-700">Привет, {user.username}</span>
                    <button onClick={logout} className="text-red-500 hover:text-red-600">Выйти</button>
                </>
            ) : (
                <>
                    <Link to="/login" className="text-gray-700 hover:text-gray-900">Вход</Link>
                    <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">Регистрация</Link>
                </>
            )}
        </div>
    </nav>
);

export default Navbar;
