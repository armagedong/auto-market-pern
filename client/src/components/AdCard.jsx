import React from 'react';

const AdCard = ({ ad }) => {
    // ЗАЩИТА ОТ ОШИБОК: Если ad не передан, ничего не рендерим
    if (!ad) return null;

    const BASE_URL = 'http://localhost:4000/';

    // Безопасная функция для получения URL фото
    const getPhotoUrl = (photoObj) => {
        if (!photoObj || !photoObj.url) return null;
        return `${BASE_URL}${photoObj.url}`;
    };

    const mainPhotoUrl = ad.Photos && ad.Photos.length > 0 ? getPhotoUrl(ad.Photos[0]) : null;
    const brandName = ad.Brand?.name || 'Неизвестно';
    const modelName = ad.Model?.name || 'Неизвестно';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                {mainPhotoUrl ? (
                    <img src={mainPhotoUrl} alt={ad.title} className="w-full h-full object-cover"/>
                ) : (
                    <span className="text-gray-400 font-bold">Нет фото</span>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-1">{ad.title}</h3>
                <p className="text-gray-600 text-sm mb-1">{brandName} {modelName} • {ad.year}</p>
                <p className="text-gray-600 text-sm mb-2">{ad.mileage} км • {ad.fuel} • {ad.gearbox}</p>
                <p className="font-bold text-blue-600 text-lg mb-2">{ad.price.toLocaleString()} ₽</p>

                {ad.Photos && ad.Photos.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto mt-auto pt-2 pb-1">
                        {ad.Photos.slice(1).map((photo, i) => (
                            <img
                                key={i}
                                src={getPhotoUrl(photo)}
                                className="h-16 w-24 object-cover rounded flex-shrink-0 border border-gray-100"
                                alt={`Фото ${i+2}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdCard;