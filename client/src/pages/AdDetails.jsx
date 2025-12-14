// client/src/pages/AdDetails.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Lightbox from '../components/Lightbox';

const BASE_URL = 'http://localhost:4000/';

export default function AdDetails() {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    useEffect(() => {
        fetchAdDetails();
    }, [id]);

    const fetchAdDetails = async () => {
        try {
            // URL запроса должен соответствовать вашему бэкенду
            const res = await axios.get(`http://localhost:4000/api/ads/${id}`);
            setAd(res.data);
            setLoading(false);
            setActivePhotoIndex(0);
        } catch (err) {
            console.error('Ошибка загрузки объявления:', err);
            setError('Не удалось найти объявление.');
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-400">Загрузка информации...</div>;
    }

    if (error) {
        return <div className="text-center py-20 text-red-500 text-xl">{error}</div>;
    }

    if (!ad) return null;

    const getPhotoUrl = (photoObj) => {
        if (!photoObj || !photoObj.url) return null;
        return `${BASE_URL}${photoObj.url.replace(/\\/g, '/')}`;
    };

    const activePhotoUrl = ad.Photos && ad.Photos.length > activePhotoIndex
        ? getPhotoUrl(ad.Photos[activePhotoIndex])
        : null;

    return (
        <>
            <div className="max-w-6xl mx-auto p-6 md:p-10">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-white mb-2">{ad.title}</h1>
                    <p className="text-3xl font-bold text-blue-400">{ad.price.toLocaleString()} ₽</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* 1. Блок фотографий с галереей */}
                    <div className="lg:col-span-2">
                        {/* Главное фото */}
                        <div
                            className="mb-4 bg-gray-800 rounded-xl overflow-hidden shadow-2xl cursor-pointer"
                            onClick={() => {
                                if (ad.Photos && ad.Photos.length > 0) {
                                    setIsLightboxOpen(true);
                                }
                            }}
                        >
                            {activePhotoUrl ? (
                                <img
                                    src={activePhotoUrl}
                                    alt={ad.title}
                                    className="w-full max-h-[500px] object-cover transition duration-300"
                                />
                            ) : (
                                <div className="w-full h-[500px] flex items-center justify-center text-gray-500">
                                    Нет основного фото
                                </div>
                            )}
                        </div>

                        {/* Миниатюры с красивым ползунком */}
                        <div className="flex space-x-3 overflow-x-auto pb-2 custom-scrollbar">
                            {ad.Photos.map((photo, index) => (
                                <img
                                    key={index}
                                    src={getPhotoUrl(photo)}
                                    alt={`Фото ${index + 1}`}
                                    onClick={() => setActivePhotoIndex(index)}
                                    className={`h-20 w-32 object-cover rounded-lg flex-shrink-0 cursor-pointer transition 
                                                ${index === activePhotoIndex
                                        ? 'border-2 border-blue-500 shadow-md'
                                        : 'border-2 border-gray-700 hover:border-blue-400 opacity-80'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* 2. Боковая панель (Контакты и Характеристики) */}
                    <aside className="lg:col-span-1 space-y-6">
                        {/* Блок контактов */}
                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
                                Связь с продавцом
                            </h2>
                            <p className="text-gray-300 text-xl font-semibold mb-2">{ad.User.nickname || 'Продавец'}</p>
                            <p className="text-blue-400 text-2xl font-extrabold mb-4">{ad.contact}</p>
                            <button className="w-full p-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-bold transition">
                                Показать телефон
                            </button>
                        </div>

                        {/* Блок характеристик */}
                        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
                            <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
                                Характеристики
                            </h2>
                            <ul className="text-gray-300 space-y-2">
                                <li className="flex justify-between border-b border-gray-700 pb-1"><span>Пробег:</span><span className="font-semibold">{ad.mileage.toLocaleString()} км</span></li>
                                <li className="flex justify-between border-b border-gray-700 pb-1"><span>Год выпуска:</span><span className="font-semibold">{ad.year}</span></li>
                                <li className="flex justify-between border-b border-gray-700 pb-1"><span>Цвет:</span><span className="font-semibold">{ad.Color?.name || 'Нет данных'}</span></li>
                                <li className="flex justify-between border-b border-gray-700 pb-1"><span>Тип топлива:</span><span className="font-semibold capitalize">{ad.fuel}</span></li>
                                <li className="flex justify-between border-b border-gray-700 pb-1"><span>КПП:</span><span className="font-semibold capitalize">{ad.gearbox}</span></li>
                                <li className="flex justify-between border-b border-gray-700 pb-1"><span>Владельцев:</span><span className="font-semibold">{ad.ptsOwners}</span></li>
                                <li className="flex justify-between border-b border-gray-700 pb-1"><span>Состояние:</span><span className={`font-semibold ${ad.state === 'good' ? 'text-green-400' : 'text-yellow-400'}`}>{ad.state === 'good' ? 'Не битый' : 'Битый'}</span></li>
                            </ul>
                        </div>
                    </aside>
                </div>

                {/* 3. Блок описания и VIN */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
                        Описание
                    </h2>
                    <p className="text-gray-300 whitespace-pre-line">{ad.description}</p>

                    <h3 className="text-xl font-bold text-white mt-6 mb-2">Дополнительно</h3>
                    <p className="text-gray-400">VIN: <span className="font-mono text-white">{ad.vin}</span></p>
                    <p className="text-gray-400">Адрес осмотра: <span className="text-white">{ad.address}</span></p>
                </div>
            </div>

            {/* РЕНДЕРИНГ LIGHTBOX */}
            {isLightboxOpen && (
                <Lightbox
                    photos={ad.Photos}
                    initialIndex={activePhotoIndex}
                    onClose={() => setIsLightboxOpen(false)}
                />
            )}
        </>
    );
}