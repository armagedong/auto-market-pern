// client/src/pages/Feed.jsx (Полный код)

import React, { useState, useEffect } from 'react';
import AdCard from '../components/AdCard';
import API from '../api/api'; // Используем наш настроенный API-клиент

// Принимаем пользователя в качестве props
export default function Feed({ user }) {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAds();
    }, [user]); // Перезагружаем объявления, если меняется статус пользователя (чтобы обновить избранное)

    const fetchAds = async () => {
        try {
            setLoading(true);
            // Если пользователь залогинен, отправляем токен, чтобы бэкенд мог отметить избранные объявления
            const res = await API.get('/ads');

            // Предполагаем, что бэкенд возвращает isFavorite для каждого объявления, если токен есть
            setAds(res.data);
        } catch (err) {
            console.error('Ошибка загрузки объявлений:', err);
            setError('Не удалось загрузить объявления.');
        } finally {
            setLoading(false);
        }
    };

    // Функция для добавления/удаления из избранного
    const handleToggleFavorite = async (adId) => {
        if (!user) {
            // Эта проверка должна быть избыточна, но оставим ее как запасную
            alert('Для добавления в избранное необходимо войти.');
            return;
        }

        try {
            const res = await API.post(`/favorites/${adId}`);

            // Обновляем локальное состояние, чтобы сердечко сразу поменяло цвет
            setAds(prevAds => prevAds.map(ad =>
                ad.id === adId ? { ...ad, isFavorite: res.data.status === 'added' } : ad
            ));

        } catch (error) {
            console.error('Ошибка избранного:', error);
            alert(`Ошибка при работе с избранным: ${error.response?.data?.error || 'Неизвестная ошибка'}`);
        }
    };


    if (loading) {
        return <div className="text-center py-20 text-gray-400">Загрузка объявлений...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 md:p-10">
            <h1 className="text-4xl font-extrabold text-white mb-8 border-b-2 border-blue-600 pb-2">
                Свежие предложения
            </h1>

            {ads.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ads.map((ad) => (
                        <AdCard
                            key={ad.id}
                            ad={ad}
                            user={user} // <-- Передаем объект пользователя
                            isFavorite={ad.isFavorite} // <-- Передаем статус
                            onToggleFavorite={handleToggleFavorite} // <-- Передаем функцию
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-800 rounded-xl shadow-lg">
                    <p className="text-gray-400 text-lg">Объявлений пока нет.</p>
                </div>
            )}
        </div>
    );
}