// client/src/components/AdCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const BASE_URL = 'http://localhost:4000/';

/**
 * @param {object} ad - Объект объявления
 * @param {object} user - Текущий авторизованный пользователь (или null)
 * @param {function} onToggleFavorite - Функция для изменения статуса избранного
 * @param {boolean} isFavorite - Флаг, указывающий, добавлено ли объявление в избранное
 */
const AdCard = ({ ad, user, onToggleFavorite, isFavorite }) => {
    if (!ad) return null;

    const getPhotoUrl = (photoObj) => {
        if (!photoObj || !photoObj.url) return null;
        // Используем replace для исправления пути, если необходимо (например, для обратных слешей Windows)
        return `${BASE_URL}${photoObj.url.replace(/\\/g, '/')}`;
    };

    const mainPhotoUrl = ad.Photos && ad.Photos.length > 0 ? getPhotoUrl(ad.Photos[0]) : null;
    const brandName = ad.Brand?.name || 'Неизвестно';
    const modelName = ad.Model?.name || 'Неизвестно';

    const handleFavoriteClick = async (e) => {
        e.preventDefault(); // Предотвращаем переход по ссылке
        e.stopPropagation(); // Предотвращаем срабатывание Link

        if (!user) {
            alert('Для добавления в избранное необходимо войти.');
            return;
        }

        if (onToggleFavorite) {
            await onToggleFavorite(ad.id);
        }
    };

    return (
        <div className="relative">
            {/* Кнопка избранного */}
            <button
                onClick={handleFavoriteClick}
                className="absolute top-3 right-3 p-2 rounded-full bg-gray-900/60 hover:bg-gray-900/80 transition z-10 focus:outline-none focus:ring-2 focus:ring-red-500"
                title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
            >
                {/* Иконка сердца */}
                <svg className={`w-6 h-6 transition ${isFavorite ? 'text-red-500 fill-red-500' : 'text-white fill-transparent stroke-white'}`}
                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="1.5">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                </svg>
            </button>

            {/* Весь остальной контент обернут в Link для кликабельности */}
            <Link to={`/ad/${ad.id}`}>
                <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">

                    {/* 1. Блок изображения */}
                    <div className="w-full h-48 bg-gray-700 flex items-center justify-center overflow-hidden">
                        {mainPhotoUrl ? (
                            <img
                                src={mainPhotoUrl}
                                alt={ad.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                            />
                        ) : (
                            <span className="text-gray-500 font-bold">Нет фото</span>
                        )}
                    </div>

                    {/* 2. Блок контента */}
                    <div className="p-4 flex flex-col flex-grow">
                        {/* Цена */}
                        <p className="font-extrabold text-2xl text-blue-400 mb-3">
                            {ad.price.toLocaleString()} ₽
                        </p>

                        {/* Заголовок */}
                        <h3 className="font-semibold text-xl text-white mb-2 line-clamp-2">
                            {ad.title}
                        </h3>

                        {/* Основные характеристики */}
                        <p className="text-gray-400 text-sm mb-3">
                            {brandName} {modelName} &bull; {ad.year} г.
                        </p>

                        {/* Детали */}
                        <div className="flex flex-wrap text-gray-500 text-xs mt-auto border-t border-gray-700 pt-3">
                            <span className="mr-3">{ad.mileage.toLocaleString()} км</span>
                            <span className="mr-3 capitalize">{ad.fuel}</span>
                            <span className="mr-3 capitalize">{ad.gearbox}</span>
                            <span className="mr-3">{ad.ptsOwners} владелец</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default AdCard;