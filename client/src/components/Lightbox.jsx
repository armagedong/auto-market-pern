// client/src/components/Lightbox.jsx

import React, { useState, useEffect, useCallback } from 'react';

const BASE_URL = 'http://localhost:4000/';

const getPhotoUrl = (photoObj) => {
    if (!photoObj || !photoObj.url) return null;
    return `${BASE_URL}${photoObj.url.replace(/\\/g, '/')}`;
};

/**
 * @param {Array<object>} photos - Массив объектов фотографий (ad.Photos)
 * @param {number} initialIndex - Индекс фотографии, которую нужно открыть первой
 * @param {function} onClose - Функция закрытия модального окна
 */
const Lightbox = ({ photos, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isZoomed, setIsZoomed] = useState(false);

    if (!photos || photos.length === 0) return null;

    const totalPhotos = photos.length;

    const nextPhoto = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
        setIsZoomed(false);
    }, [totalPhotos]);

    const prevPhoto = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPhotos) % totalPhotos);
        setIsZoomed(false);
    }, [totalPhotos]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextPhoto();
            else if (e.key === 'ArrowLeft') prevPhoto();
            else if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextPhoto, prevPhoto, onClose]);

    const currentPhotoUrl = getPhotoUrl(photos[currentIndex]);

    const handleBackdropClick = (e) => {
        if (e.target.id === 'lightbox-backdrop') {
            onClose();
        }
    };

    const ArrowButton = ({ direction, onClick, children }) => (
        <button
            className={`absolute top-1/2 transform -translate-y-1/2 p-3 bg-black/50 text-white rounded-full 
                        transition hover:bg-blue-500/80 z-50 focus:outline-none text-3xl font-light select-none
                        ${direction === 'left' ? 'left-4' : 'right-4'}`}
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
        >
            {children}
        </button>
    );

    return (
        <div
            id="lightbox-backdrop"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 transition-opacity duration-300 overflow-auto"
            onClick={handleBackdropClick}
        >
            {/* Навигационные кнопки */}
            {totalPhotos > 1 && (
                <>
                    <ArrowButton direction="left" onClick={prevPhoto}>
                        &lsaquo;
                    </ArrowButton>
                    <ArrowButton direction="right" onClick={nextPhoto}>
                        &rsaquo;
                    </ArrowButton>
                </>
            )}

            {/* Контейнер изображения */}
            <div
                className={`p-4 transition-all duration-300 ${isZoomed ? 'max-w-none max-h-none cursor-grab' : 'max-w-screen-lg max-h-full'}`}
                onClick={(e) => {
                    e.stopPropagation(); // Не закрываем по клику на контейнер
                    setIsZoomed(!isZoomed); // Переключаем зум
                }}
            >
                <img
                    src={currentPhotoUrl}
                    alt={`Фото ${currentIndex + 1}`}
                    className={`rounded-lg shadow-2xl transition-all duration-300 
                                ${isZoomed ? 'object-initial w-auto h-auto cursor-grabbing' : 'object-contain w-full max-h-[85vh] cursor-zoom-in'}`}
                    style={{
                        maxHeight: isZoomed ? 'none' : '85vh',
                        maxWidth: isZoomed ? 'none' : '90vw'
                    }}
                />
            </div>

            {/* Элементы управления вверху */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-black/50 flex justify-between items-center text-white z-50">
                {/* Индикатор фото */}
                <span className="text-lg font-medium select-none">
                    {currentIndex + 1} из {totalPhotos}
                </span>

                {/* Кнопка режима приближения/панорамирования */}
                <button
                    className="py-1 px-3 bg-gray-700/70 hover:bg-blue-500 rounded text-sm transition focus:outline-none"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsZoomed(!isZoomed);
                    }}
                    title={isZoomed ? "Выйти из режима панорамирования" : "Приблизить и панорамировать"}
                >
                    {isZoomed ? 'Подогнать под экран' : 'Приблизить'}
                </button>

                {/* Кнопка закрытия */}
                <button
                    className="text-white text-4xl font-light opacity-80 hover:opacity-100 transition focus:outline-none select-none"
                    onClick={onClose}
                    title="Закрыть (Esc)"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};

export default Lightbox;