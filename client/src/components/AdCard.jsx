import React from 'react';
import { Link } from 'react-router-dom'; // <-- Импортируем Link

const AdCard = ({ ad }) => {
    if (!ad) return null;

    // ... (Остальная логика и переменные остаются прежними)
    const BASE_URL = 'http://localhost:4000/';
    const getPhotoUrl = (photoObj) => {
        if (!photoObj || !photoObj.url) return null;
        return `${BASE_URL}${photoObj.url}`;
    };

    const mainPhotoUrl = ad.Photos && ad.Photos.length > 0 ? getPhotoUrl(ad.Photos[0]) : null;
    const brandName = ad.Brand?.name || 'Неизвестно';
    const modelName = ad.Model?.name || 'Неизвестно';

    return (
        // Оборачиваем всю карточку в Link
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
                    <h3 className="font-semibold text-xl text-white mb-2 truncate">
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
    );
};

export default AdCard;