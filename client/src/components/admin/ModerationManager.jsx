import React, { useState, useEffect } from 'react';
import API from '../../api/api';

const API_URL = 'http://localhost:4000';

export default function ModerationManager() {
    const [ads, setAds] = useState([]);
    const [selectedAd, setSelectedAd] = useState(null);

    useEffect(() => {
        fetchPendingAds();
    }, []);

    const fetchPendingAds = async () => {
        try {
            const res = await API.get('/admin/moderation');
            setAds(res.data);
        } catch (e) { console.error(e); }
    };

    const handleAction = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await API.put(`/admin/moderation/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAds(prev => prev.filter(ad => ad.id !== id));
            setSelectedAd(null);
        } catch (e) { alert("Ошибка доступа или сервера"); }
    };

    const fixPath = (url) => url ? `${API_URL}/${url.replace(/\\/g, '/')}` : '';

    return (
        <div className="space-y-4">
            {ads.length === 0 && (
                <div className="text-center py-20 bg-[#1a1d26] rounded-[2.5rem] border border-dashed border-gray-800 text-gray-500 uppercase text-xs font-bold tracking-widest">
                    Очередь модерации пуста
                </div>
            )}

            {/* СПИСОК КАРТОЧЕК */}
            <div className="grid grid-cols-1 gap-4">
                {ads.map(ad => (
                    <div key={ad.id} className="bg-[#1a1d26] p-4 rounded-[2rem] border border-gray-800 flex items-center gap-6 hover:border-blue-500/30 transition-all group">
                        <img
                            src={fixPath(ad.Photos?.[0]?.url)}
                            className="w-24 h-24 object-cover rounded-2xl bg-black shrink-0 shadow-xl"
                            alt="car"
                        />
                        <div className="flex-grow">
                            <h3 className="font-black text-xl italic uppercase tracking-tighter">
                                {ad.Brand?.name} <span className="text-gray-400">{ad.Model?.name}</span>
                            </h3>
                            <p className="text-blue-500 font-black text-xl">{ad.price?.toLocaleString()} ₽</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">ID: {ad.id} • Юзер: {ad.User?.username || 'Guest'}</p>
                        </div>
                        <button
                            onClick={() => setSelectedAd(ad)}
                            className="bg-white text-black hover:bg-blue-500 hover:text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg"
                        >
                            Обзор
                        </button>
                    </div>
                ))}
            </div>

            {/* БОЛЬШОЕ МОДАЛЬНОЕ ОКНО */}
            {selectedAd && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[#0f1117] w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[3rem] border border-gray-800 relative shadow-2xl flex flex-col md:flex-row">

                        {/* Кнопка закрытия */}
                        <button
                            onClick={() => setSelectedAd(null)}
                            className="absolute top-6 right-6 z-50 bg-white/10 hover:bg-red-500 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-xl border border-white/10"
                        >
                            ✕
                        </button>

                        {/* ЛЕВАЯ ЧАСТЬ: ГАЛЕРЕЯ */}
                        <div className="w-full md:w-3/5 bg-black flex flex-col relative">
                            <div className="flex-grow overflow-hidden">
                                <img
                                    src={fixPath(selectedAd.Photos?.[0]?.url)}
                                    className="w-full h-full object-contain"
                                    alt="Full view"
                                />
                            </div>
                            {/* Превью всех фото снизу (если их много) */}
                            {selectedAd.Photos?.length > 1 && (
                                <div className="p-6 flex gap-3 overflow-x-auto bg-gradient-to-t from-black to-transparent absolute bottom-0 w-full">
                                    {selectedAd.Photos.map((p, i) => (
                                        <img key={i} src={fixPath(p.url)} className="w-20 h-14 object-cover rounded-lg border border-white/20 hover:border-blue-500 cursor-pointer transition-all" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ПРАВАЯ ЧАСТЬ: ИНФОРМАЦИЯ */}
                        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between bg-[#0f1117]">
                            <div>
                                <div className="mb-8">
                                    <h2 className="text-4xl font-black uppercase italic leading-none">{selectedAd.Brand?.name}</h2>
                                    <h3 className="text-2xl font-bold text-gray-500 mb-2">{selectedAd.Model?.name} {selectedAd.Generation?.name}</h3>
                                    <div className="inline-block bg-blue-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mt-2">
                                        На проверке
                                    </div>
                                </div>

                                {/* СЕТКА ХАРАКТЕРИСТИК */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-[#1a1d26] p-4 rounded-3xl border border-gray-800">
                                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Цена</p>
                                        <p className="text-xl font-black text-blue-500">{selectedAd.price?.toLocaleString()} ₽</p>
                                    </div>
                                    <div className="bg-[#1a1d26] p-4 rounded-3xl border border-gray-800">
                                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Год выпуска</p>
                                        <p className="text-xl font-black">{selectedAd.year} г.</p>
                                    </div>
                                    <div className="bg-[#1a1d26] p-4 rounded-3xl border border-gray-800">
                                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Пробег</p>
                                        <p className="text-xl font-black">{selectedAd.mileage?.toLocaleString()} км</p>
                                    </div>
                                    <div className="bg-[#1a1d26] p-4 rounded-3xl border border-gray-800">
                                        <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Цвет</p>
                                        <p className="text-xl font-black">{selectedAd.Color?.name || '—'}</p>
                                    </div>
                                </div>

                                {/* ОПИСАНИЕ */}
                                <div className="mb-8">
                                    <p className="text-[10px] text-gray-500 font-black uppercase mb-3 ml-1">Комментарий продавца</p>
                                    <div className="bg-[#1a1d26] p-5 rounded-3xl border border-gray-800 text-sm text-gray-300 leading-relaxed italic">
                                        "{selectedAd.description || 'Описание отсутствует'}"
                                    </div>
                                </div>

                                {/* ИНФО О ПРОДАВЦЕ */}
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-3xl border border-white/5 mb-8">
                                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-black">
                                        {selectedAd.User?.username?.[0] || 'U'}
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-500 font-black uppercase">Продавец</p>
                                        <p className="font-bold">{selectedAd.User?.username}</p>
                                        <p className="text-xs text-blue-400 font-medium">{selectedAd.User?.phone || 'Телефон скрыт'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* КНОПКИ ДЕЙСТВИЯ */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => handleAction(selectedAd.id, 'approved')}
                                    className="flex-1 bg-green-600 hover:bg-green-500 py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-green-600/20 transition-all active:scale-95"
                                >
                                    Одобрить
                                </button>
                                <button
                                    onClick={() => handleAction(selectedAd.id, 'rejected')}
                                    className="flex-1 bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white py-5 rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95"
                                >
                                    Отклонить
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}