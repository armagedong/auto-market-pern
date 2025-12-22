import React, { useState, useEffect } from 'react';
import API from '../api/api';
import FilterPanel from '../components/FilterPanel';
import AdCard from '../components/AdCard';

export default function Feed() {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    // ПОЛНЫЙ список фильтров, ничего не забыто
    const [filters, setFilters] = useState({
        brandId: '',
        modelId: '',
        generationId: '',
        colorId: '',
        state: '',
        priceFrom: '',
        priceTo: '',
        yearFrom: '',
        yearTo: '',
        mileageFrom: '',
        mileageTo: '',
        search: '',
        sort: 'newest' // По умолчанию: новые
    });

    const fetchAds = async () => {
        setLoading(true);
        try {
            // Убираем пустые поля перед отправкой
            const params = {};
            Object.keys(filters).forEach(key => {
                if (filters[key] !== '') params[key] = filters[key];
            });

            const response = await API.get('/ads', { params });
            setAds(response.data);
        } catch (error) {
            console.error("Ошибка загрузки объявлений:", error);
        } finally {
            setLoading(false);
        }
    };

    // Загрузка при первом входе и при смене сортировки (автоматически)
    useEffect(() => {
        fetchAds();
    }, [filters.sort]);

    return (
        <div className="min-h-screen bg-[#0f1117] text-white pt-10 pb-12">
            <div className="max-w-[1440px] mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* ЛЕВАЯ КОЛОНКА: ФИЛЬТРЫ (STICKY) */}
                    <aside className="w-full lg:w-[350px] sticky top-24 shrink-0">
                        <FilterPanel
                            filters={filters}
                            setFilters={setFilters}
                            onSearch={fetchAds}
                        />
                    </aside>

                    {/* ПРАВАЯ КОЛОНКА: КОНТЕНТ */}
                    <main className="flex-1">
                        <div className="flex justify-between items-center mb-8 bg-[#1a1d26] p-6 rounded-[2rem] border border-gray-800">
                            <div>
                                <p className="text-gray-500 font-medium">Найдено: {ads.length} объявлений</p>
                            </div>

                            {/* Быстрый переключатель вида или доп. инфо */}
                            <div className="hidden sm:block text-sm text-gray-400">
                                Сортировка: <span className="text-blue-500 font-bold">{filters.sort === 'newest' ? 'По дате' : 'По цене'}</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[1,2,3,4,5,6].map(i => (
                                    <div key={i} className="h-[450px] bg-[#1a1d26] rounded-[2.5rem] animate-pulse border border-gray-800"></div>
                                ))}
                            </div>
                        ) : ads.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {ads.map(ad => (
                                    <AdCard key={ad.id} ad={ad} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-[#1a1d26] rounded-[3rem] border border-dashed border-gray-700">
                                <h2 className="text-2xl font-bold mt-4">Ничего не найдено</h2>
                                <button
                                    onClick={() => { setFilters({sort:'newest', brandId:''}); fetchAds(); }}
                                    className="mt-6 text-blue-500 font-bold hover:underline"
                                >
                                    Сбросить всё
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}