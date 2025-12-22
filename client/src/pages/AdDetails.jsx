import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function AdDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activePhoto, setActivePhoto] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showPhone, setShowPhone] = useState(false);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await API.get(`/ads/${id}`);
                setAd(res.data);
                setIsFavorite(res.data.isFavorite);
            } catch (err) {
                console.error("Ошибка:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAd();
    }, [id]);

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

    if (loading) return <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-blue-500 font-bold">ЗАГРУЗКА...</div>;
    if (!ad) return <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-white">Объявление не найдено</div>;

    const getFullPhotoUrl = (url) => `http://localhost:4000${url.startsWith('/') ? '' : '/'}${url}`;

    return (
        <div className="min-h-screen bg-[#0f1117] text-white pt-24 pb-20">
            <div className="max-w-[1280px] mx-auto px-4">

                <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-white transition-all">
                    <span>←</span> Назад к поиску
                </button>

                {/* ОСНОВНОЙ ГРИД: 8 колонок для контента, 4 для панели */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* ЛЕВАЯ ЧАСТЬ (8 колонок) */}
                    <div className="lg:col-span-8 space-y-6 w-full overflow-hidden">

                        {/* ГЛАВНОЕ ФОТО */}
                        <div className="relative bg-[#1a1d26] rounded-3xl overflow-hidden border border-gray-800 aspect-video shadow-2xl">
                            <img
                                src={ad.Photos?.[activePhoto] ? getFullPhotoUrl(ad.Photos[activePhoto].url) : 'https://via.placeholder.com/800x500?text=Нет+фото'}
                                className="w-full h-full object-cover"
                                alt="Main"
                            />
                            <div className="absolute top-4 left-4 bg-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                                {ad.state === 'excellent' ? 'Отличное' : 'Хорошее'}
                            </div>
                        </div>

                        {/* МИНИАТЮРЫ */}
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {ad.Photos?.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActivePhoto(i)}
                                    className={`relative shrink-0 w-24 h-16 rounded-xl overflow-hidden border-2 transition-all ${activePhoto === i ? 'border-blue-500 scale-105' : 'border-gray-800 opacity-50'}`}
                                >
                                    <img src={getFullPhotoUrl(p.url)} className="w-full h-full object-cover" alt="thumb" />
                                </button>
                            ))}
                        </div>

                        {/* ТЕХНИЧЕСКИЕ ХАРАКТЕРИСТИКИ */}
                        <div className="bg-[#1a1d26] p-6 lg:p-8 rounded-3xl border border-gray-800">
                            <h2 className="text-xl font-black mb-6 uppercase tracking-tight text-gray-300">Технические данные</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                                <SpecRow label="Марка" value={ad.Brand?.name} />
                                <SpecRow label="Модель" value={ad.Model?.name} />
                                <SpecRow label="Поколение" value={ad.Generation?.name} />
                                <SpecRow label="Год" value={ad.year} />
                                <SpecRow label="Пробег" value={`${ad.mileage?.toLocaleString()} км`} />
                                <SpecRow label="Цвет" value={ad.Color?.name} />
                            </div>
                        </div>

                        {/* ОПИСАНИЕ */}
                        <div className="bg-[#1a1d26] p-6 lg:p-8 rounded-3xl border border-gray-800">
                            <h2 className="text-xl font-black mb-4 uppercase tracking-tight text-gray-300">Описание</h2>
                            <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">
                                {ad.description || "Без описания."}
                            </p>
                        </div>
                    </div>

                    {/* ПРАВАЯ ЧАСТЬ (4 колонки) */}
                    <aside className="lg:col-span-4 space-y-4 w-full lg:sticky lg:top-24">
                        <div className="bg-[#1a1d26] p-8 rounded-3xl border border-gray-800 shadow-3xl">
                            <div className="mb-6">
                                <h1 className="text-2xl font-black leading-tight mb-1">
                                    {ad.Brand?.name} {ad.Model?.name}
                                </h1>
                                <p className="text-gray-500 text-xs font-bold uppercase">{ad.year} год • {ad.mileage?.toLocaleString()} км</p>
                            </div>

                            <div className="text-4xl font-black text-white mb-8 tracking-tighter">
                                {ad.price?.toLocaleString()} <span className="text-blue-500 text-xl">₽</span>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setShowPhone(!showPhone)}
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20"
                                >
                                    {showPhone ? ad.contact || '+7 (900) 000-00-00' : 'Показать телефон'}
                                </button>

                                <div className="flex gap-3">
                                    <button className="flex-[3] py-4 bg-gray-800 hover:bg-gray-700 text-white font-black rounded-2xl transition-all uppercase text-[10px] tracking-widest">
                                        Написать
                                    </button>
                                    <button
                                        onClick={toggleFavorite}
                                        className={`flex-1 flex items-center justify-center rounded-2xl border transition-all ${isFavorite ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-gray-800 bg-gray-800 text-gray-500'}`}
                                    >
                                        <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-800 flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-lg font-black shadow-lg shadow-blue-900/40">
                                    {ad.User?.username?.[0]?.toUpperCase() || 'A'}
                                </div>
                                <div>
                                    <div className="text-sm font-black">{ad.User?.username || 'Продавец'}</div>
                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">📍 {ad.address}</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl">
                            <p className="text-gray-500 text-[10px] leading-relaxed">
                                <span className="text-yellow-500 font-bold">ВНИМАНИЕ:</span> Не переводите предоплату продавцу до личного осмотра автомобиля.
                            </p>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
}

function SpecRow({ label, value }) {
    return (
        <div className="flex justify-between items-end border-b border-gray-800/40 pb-2">
            <span className="text-gray-500 text-xs font-medium">{label}</span>
            <span className="text-white font-bold text-xs">{value || '—'}</span>
        </div>
    );
}