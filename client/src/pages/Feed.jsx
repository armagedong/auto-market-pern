import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdCard from '../components/AdCard'; // Убедитесь, что импорт правильный

export default function Feed() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            // Вы можете добавить фильтры или пагинацию здесь позже
            const res = await axios.get('http://localhost:4000/api/ads');
            // Предполагаем, что бэкенд возвращает только одобренные объявления
            setAds(res.data);
        } catch (err) {
            console.error('Ошибка загрузки объявлений:', err);
            setError('Не удалось загрузить объявления.');
        } finally {
            setLoading(false);
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
                Объявления для вас
            </h1>

            {ads.length > 0 ? (
                // Адаптивная сетка для карточек
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ads.map((ad) => (
                        <AdCard key={ad.id} ad={ad} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-800 rounded-xl shadow-lg">
                    <p className="text-gray-400 text-lg">Объявлений пока нет.</p>
                    <p className="text-gray-500 mt-2">Будьте первым, кто разместит свое авто!</p>
                </div>
            )}
        </div>
    );
}