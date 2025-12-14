// client/src/pages/Profile.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdCard from '../components/AdCard';
import API from '../api/api'; // Клиент API
import { useNavigate } from 'react-router-dom';

export default function Profile({ user }) {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchFavorites();
    }, [user, navigate]);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const res = await API.get('/favorites');
            // Получаем массив объявлений, каждое с полем isFavorite = true
            setFavorites(res.data.map(ad => ({ ...ad, isFavorite: true })));
        } catch (err) {
            console.error('Ошибка загрузки избранного:', err);
            // Если ошибка 401/403 (токен недействителен)
            if (err.response && err.response.status >= 400 && err.response.status < 500) {
                // Тут должна быть логика очистки токена и перенаправления на вход
            }
        } finally {
            setLoading(false);
        }
    };

    // Функция для обновления статуса избранного (удаления)
    const handleToggleFavorite = async (adId) => {
        try {
            await API.post(`/favorites/${adId}`);
            // Удаляем объявление из локального списка
            setFavorites(favorites.filter(ad => ad.id !== adId));
        } catch (error) {
            console.error('Ошибка удаления из избранного:', error);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-400">Загрузка профиля...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-extrabold text-white mb-8 border-b-2 border-blue-600 pb-2">
                Привет, {user.username}
            </h1>

            <section className="mb-10">
                <h2 className="text-3xl font-bold text-white mb-6">Ваше избранное ({favorites.length})</h2>
                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map((ad) => (
                            <AdCard
                                key={ad.id}
                                ad={ad}
                                user={user}
                                onToggleFavorite={handleToggleFavorite}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-gray-800 rounded-xl shadow-lg">
                        <p className="text-gray-400 text-lg">У вас пока нет избранных объявлений.</p>
                    </div>
                )}
            </section>

            {/* Секция для ваших объявлений (можно добавить позже) */}
            {/* <section>
                <h2 className="text-3xl font-bold text-white mb-6">Ваши объявления</h2>
                ...
            </section> */}
        </div>
    );
}