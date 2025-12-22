// client/src/pages/ModerationPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function ModerationPage({ user }) {
    const [pendingAds, setPendingAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 🛡️ Проверка доступа при загрузке компонента
    useEffect(() => {
        if (!user || user.role !== 'moderator') {
            navigate('/'); // Перенаправляем, если нет прав
            alert('Доступ только для модераторов.');
        }
    }, [user, navigate]);

    // Загрузка объявлений на модерации
    const fetchPendingAds = async () => {
        if (!user || user.role !== 'moderator') return;
        setLoading(true);
        setError(null);
        try {
            const response = await API.get('/moderation/pending');
            setPendingAds(response.data);
        } catch (err) {
            setError(`Ошибка загрузки очереди: ${err.response?.data?.error || 'Неизвестная ошибка'}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.role === 'moderator') {
            fetchPendingAds();
        }
    }, [user]);

    // Обработчик решения модератора
    const handleDecision = async (adId, newStatus) => {
        if (!window.confirm(`Вы уверены, что хотите ${newStatus === 'approved' ? 'ОДОБРИТЬ' : 'ОТКЛОНИТЬ'} объявление ID ${adId}?`)) {
            return;
        }

        try {
            await API.post('/moderation/decide', { adId, newStatus });

            // Успех: удаляем объявление из списка
            setPendingAds(prev => prev.filter(ad => ad.id !== adId));

        } catch (err) {
            setError(`Ошибка при принятии решения: ${err.response?.data?.error || 'Неизвестная ошибка'}`);
            console.error(err);
        }
    };

    if (!user || user.role !== 'moderator') return null;

    if (loading) return <div className="max-w-7xl mx-auto p-6 text-white mt-10">Загрузка очереди модерации...</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 mt-10 mb-20">
            <h1 className="text-3xl font-bold text-red-400 mb-8 border-b border-gray-700 pb-2">
                Панель Модерации
            </h1>

            {error && <div className="p-3 bg-red-900/50 text-red-300 rounded-lg mb-4">{error}</div>}

            <h2 className="text-xl text-white mb-4">Объявления на проверке ({pendingAds.length})</h2>

            {pendingAds.length === 0 ? (
                <div className="p-4 bg-gray-800 text-green-400 rounded-lg border-l-4 border-green-600">
                    Очередь модерации пуста.
                </div>
            ) : (
                <div className="space-y-6">
                    {pendingAds.map(ad => (
                        <div key={ad.id} className="p-5 bg-gray-800 rounded-lg shadow-lg border-l-4 border-yellow-600">
                            <p className="text-2xl font-semibold text-white mb-2">{ad.title}</p>
                            <p className="text-gray-400 text-sm">
                                ID: {ad.id} | Автор: {ad.author?.username || 'N/A'} ({ad.author?.email || 'N/A'})
                            </p>
                            <p className="text-gray-300 mt-2 mb-4">
                                {ad.description.substring(0, 300)}...
                            </p>

                            <div className="flex justify-end space-x-3 mt-4">
                                <button
                                    onClick={() => handleDecision(ad.id, 'rejected')}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
                                >
                                    Отклонить
                                </button>
                                <button
                                    onClick={() => handleDecision(ad.id, 'approved')}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                                >
                                    Одобрить
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}