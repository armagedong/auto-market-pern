import React, { useState, useEffect } from 'react';
import API from '../api/api';

export default function FilterPanel({ filters, setFilters, onSearch }) {
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [generations, setGenerations] = useState([]);
    const [colors, setColors] = useState([]);

    useEffect(() => {
        API.get('/brands').then(res => setBrands(res.data));
        API.get('/colors').then(res => setColors(res.data));
    }, []);

    // Каскадная загрузка Моделей
    useEffect(() => {
        if (filters.brandId) {
            API.get(`/models?brand_id=${filters.brandId}`).then(res => setModels(res.data));
        } else {
            setModels([]);
        }
        setFilters(prev => ({ ...prev, modelId: '', generationId: '' }));
    }, [filters.brandId]);

    // Каскадная загрузка Поколений
    useEffect(() => {
        if (filters.modelId) {
            API.get(`/generations?model_id=${filters.modelId}`).then(res => setGenerations(res.data));
        } else {
            setGenerations([]);
        }
        setFilters(prev => ({ ...prev, generationId: '' }));
    }, [filters.modelId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-[#1a1d26] p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black uppercase">Фильтры</h3>
                <button onClick={() => window.location.reload()} className="text-xs text-gray-500 hover:text-white transition-colors">СБРОСИТЬ</button>
            </div>

            {/* Текстовый поиск и сортировка */}
            <div className="space-y-3">
                <input
                    name="search" placeholder="Поиск по названию..."
                    className="w-full p-4 bg-gray-800/50 rounded-2xl border border-gray-700 outline-none focus:border-blue-500 transition-all"
                    onChange={handleChange}
                />
                <select name="sort" value={filters.sort} onChange={handleChange} className="w-full p-4 bg-gray-800/50 rounded-2xl border border-gray-700 text-sm font-bold text-blue-400">
                    <option value="newest">Сначала свежие объявления</option>
                    <option value="price_asc">Дешевле</option>
                    <option value="price_desc">Дороже</option>
                    <option value="year_desc">Сначала новые авто (год)</option>
                    <option value="mileage_asc">Минимальный пробег</option>
                </select>
            </div>

            {/* Выбор авто */}
            <div className="space-y-3 pt-4 border-t border-gray-800">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2">Автомобиль</label>
                <select name="brandId" value={filters.brandId} onChange={handleChange} className="w-full p-4 bg-gray-800 rounded-2xl border-none">
                    <option value="">Все марки</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <select name="modelId" value={filters.modelId} onChange={handleChange} disabled={!filters.brandId} className="w-full p-4 bg-gray-800 rounded-2xl border-none disabled:opacity-30">
                    <option value="">Все модели</option>
                    {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                <select name="generationId" value={filters.generationId} onChange={handleChange} disabled={!filters.modelId} className="w-full p-4 bg-gray-800 rounded-2xl border-none disabled:opacity-30">
                    <option value="">Все поколения</option>
                    {generations.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
            </div>

            {/* Диапазоны */}
            <div className="space-y-4 pt-4 border-t border-gray-800">
                <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 block mb-2">Цена, ₽</label>
                    <div className="flex gap-2">
                        <input name="priceFrom" type="number" placeholder="От" className="w-1/2 p-4 bg-gray-800 rounded-2xl outline-none" onChange={handleChange} />
                        <input name="priceTo" type="number" placeholder="До" className="w-1/2 p-4 bg-gray-800 rounded-2xl outline-none" onChange={handleChange} />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-2 block mb-2">Год выпуска</label>
                    <div className="flex gap-2">
                        <input name="yearFrom" type="number" placeholder="От" className="w-1/2 p-4 bg-gray-800 rounded-2xl outline-none" onChange={handleChange} />
                        <input name="yearTo" type="number" placeholder="До" className="w-1/2 p-4 bg-gray-800 rounded-2xl outline-none" onChange={handleChange} />
                    </div>
                </div>
            </div>

            {/* Дополнительно */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
                <select name="colorId" onChange={handleChange} className="p-4 bg-gray-800 rounded-2xl text-xs">
                    <option value="">Цвет</option>
                    {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <select name="state" onChange={handleChange} className="p-4 bg-gray-800 rounded-2xl text-xs">
                    <option value="">Состояние</option>
                    <option value="excellent">Отличное</option>
                    <option value="good">Хорошее</option>
                    <option value="need_repair">Битая/Не на ходу</option>
                </select>
            </div>

            <button
                onClick={onSearch}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[1.5rem] transition-all shadow-lg shadow-blue-900/30 active:scale-95 uppercase tracking-widest text-sm"
            >
                Найти машину
            </button>
        </div>
    );
}