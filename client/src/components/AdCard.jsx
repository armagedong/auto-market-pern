import React from 'react';

const AdCard = ({ ad }) => {
    const mainPhoto = ad.photos && ad.photos.length > 0 ? ad.photos[0] : 'https://via.placeholder.com/400x250';

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Обложка */}
            <img src={mainPhoto} alt={ad.title} className="w-full h-48 object-cover"/>

            <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{ad.title}</h3>
                <p className="text-gray-600 text-sm mb-1">{ad.brand} {ad.model} • {ad.year}</p>
                <p className="text-gray-600 text-sm mb-2">{ad.mileage} км • {ad.fuel} • {ad.gearbox}</p>
                <p className="font-bold text-blue-600 text-lg mb-2">{ad.price.toLocaleString()} ₽</p>

                {/* Галерея дополнительных фото */}
                {ad.photos && ad.photos.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto mt-2">
                        {ad.photos.slice(1).map((photo, i) => (
                            <img
                                key={i}
                                src={photo}
                                className="h-24 w-32 object-cover rounded flex-shrink-0"
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
