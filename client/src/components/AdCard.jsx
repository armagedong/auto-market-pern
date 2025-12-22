import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

export default function AdCard({ ad }) {
    const [isFavorite, setIsFavorite] = useState(ad.isFavorite || false);

    const toggleFavorite = async (e) => {
        if (e) e.preventDefault(); // Защита от перезагрузки

        // 1. Берем токен ПРЯМО СЕЙЧАС из хранилища
        const token = localStorage.getItem('token');

        if (!token) {
            return alert("Брат, ты не вошел в аккаунт!");
        }

        // 2. Формируем конфиг с заголовком вручную
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            if (isFavorite) {
                // УДАЛЯЕМ (передаем ID в URL)
                await API.delete(`/favorites/${ad.id}`, config);
            } else {
                // ДОБАВЛЯЕМ (передаем объект в body, а config третьим параметром)
                await API.post(`/favorites/${ad.id}`, config);
            }

            // 3. Если запрос прошел — меняем сердечко
            setIsFavorite(!isFavorite);

        } catch (err) {
            console.error("Ошибка запроса:", err.response?.data);
            alert(err.response?.data?.message || "Ошибка при связи с сервером");
        }
    };

    // Исправленный путь к фото
    const photoUrl = ad.Photos && ad.Photos.length > 0
        ? `http://localhost:4000${ad.Photos[0].url.startsWith('/') ? '' : '/'}${ad.Photos[0].url}`
        : 'https://via.placeholder.com/600x400?text=Нет+фото';

    return (
        <Link to={`/ad/${ad.id}`} className="group flex flex-col bg-[#1a1d26] rounded-[2rem] overflow-hidden border border-gray-800 transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] hover:-translate-y-2 h-[480px]">
            {/* ФОТО С ФИКСИРОВАННОЙ ВЫСОТОЙ */}
            <div className="relative h-52 w-full shrink-0 overflow-hidden bg-gray-900">
                <img
                    src={photoUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Кнопка Избранное */}
                <button
                    onClick={toggleFavorite}
                    className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all"
                >
                    <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
                </button>

                <div className="absolute bottom-4 left-4 bg-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest text-white">
                    {ad.year} г.
                </div>
            </div>

            {/* КОНТЕНТ */}
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-black text-white line-clamp-1 group-hover:text-blue-500 transition-colors">
                        {ad.Brand?.name} {ad.Model?.name}
                    </h3>
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mb-4">
                    {ad.Generation?.name || 'Стандарт'}
                </p>

                <div className="text-3xl font-black text-white mb-auto">
                    {ad.price?.toLocaleString('ru-RU')} <span className="text-blue-500 text-lg">₽</span>
                </div>

                {/* Параметры */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-gray-800/50 rounded-2xl p-3 border border-gray-700/30">
                        <span className="block text-[9px] text-gray-500 uppercase font-black mb-1">Пробег</span>
                        <span className="text-sm font-bold">{ad.mileage?.toLocaleString()} км</span>
                    </div>
                    <div className="bg-gray-800/50 rounded-2xl p-3 border border-gray-700/30">
                        <span className="block text-[9px] text-gray-500 uppercase font-black mb-1">Цвет</span>
                        <span className="text-sm font-bold truncate">{ad.Color?.name || '—'}</span>
                    </div>
                </div>

                {/* Город и Дата */}
                <div className="mt-5 pt-4 border-t border-gray-800 flex justify-between items-center text-gray-500 text-[11px] font-medium">
                    <div className="flex items-center gap-1">
                        <span className="truncate max-w-[120px]">{ad.city || ad.address || 'Москва'}</span>
                    </div>
                    <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </Link>
    );
}