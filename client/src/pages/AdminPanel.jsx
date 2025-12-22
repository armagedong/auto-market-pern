import React, { useState, useEffect } from 'react';
import API from '../api/api';

export default function AdminPanel() {
    // Состояние навигации (где мы сейчас)
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);

    // Данные списков
    const [items, setItems] = useState([]);

    // Поле ввода для создания (универсальное)
    const [newItemName, setNewItemName] = useState('');
    // Доп поля для поколений
    const [yearStart, setYearStart] = useState('');
    const [yearEnd, setYearEnd] = useState('');

    useEffect(() => {
        fetchData();
    }, [selectedBrand, selectedModel]);

    // Универсальная загрузка данных в зависимости от уровня вложенности
    const fetchData = async () => {
        try {
            setItems([]); // Очистка перед загрузкой
            let res;
            if (!selectedBrand) {
                // Уровень 1: Бренды
                res = await API.get('/brands');
            } else if (selectedBrand && !selectedModel) {
                // Уровень 2: Модели
                res = await API.get(`/brands/${selectedBrand.id}/models`);
            } else {
                // Уровень 3: Поколения
                res = await API.get(`/brands/models/${selectedModel.id}/generations`);
            }
            setItems(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Создание записи
    const handleCreate = async () => {
        if (!newItemName) return;
        try {
            if (!selectedBrand) {
                await API.post('/brands', { name: newItemName });
            } else if (selectedBrand && !selectedModel) {
                await API.post('/brands/models', { name: newItemName, brandId: selectedBrand.id });
            } else {
                await API.post('/brands/generations', {
                    name: newItemName,
                    modelId: selectedModel.id,
                    yearStart: yearStart || null,
                    yearEnd: yearEnd || null
                });
            }
            setNewItemName('');
            setYearStart('');
            setYearEnd('');
            fetchData();
        } catch (err) {
            alert("Ошибка создания. Проверь права админа.");
        }
    };

    // Удаление (теперь благодаря CASCADE удаляет всё дерево)
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Чтобы не провалиться внутрь при клике на кнопку удаления
        const type = !selectedBrand ? "Бренд" : !selectedModel ? "Модель" : "Поколение";
        if (!window.confirm(`Удалить ${type}? Это действие необратимо.`)) return;

        try {
            let url = '';
            if (!selectedBrand) url = `/brands/${id}`;
            else if (!selectedModel) url = `/brands/models/${id}`;
            else url = `/brands/generations/${id}`;

            await API.delete(url);
            fetchData();
        } catch (err) {
            alert("Ошибка удаления.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0f1117] text-white pt-24 px-4 pb-20">
            <div className="max-w-4xl mx-auto">

                {/* ХЛЕБНЫЕ КРОШКИ */}
                <div className="flex items-center gap-2 mb-8 text-xl font-bold">
                    <button
                        onClick={() => { setSelectedBrand(null); setSelectedModel(null); }}
                        className={`hover:text-blue-500 transition-colors ${!selectedBrand ? 'text-white' : 'text-gray-500'}`}
                    >
                        Все Бренды
                    </button>

                    {selectedBrand && (
                        <>
                            <span className="text-gray-600">/</span>
                            <button
                                onClick={() => setSelectedModel(null)}
                                className={`hover:text-blue-500 transition-colors ${!selectedModel ? 'text-white' : 'text-gray-500'}`}
                            >
                                {selectedBrand.name}
                            </button>
                        </>
                    )}

                    {selectedModel && (
                        <>
                            <span className="text-gray-600">/</span>
                            <span className="text-white">{selectedModel.name} (Поколения)</span>
                        </>
                    )}
                </div>

                {/* ФОРМА ДОБАВЛЕНИЯ */}
                <div className="bg-[#1a1d26] p-6 rounded-2xl border border-gray-800 mb-8 flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1 w-full">
                        <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">
                            {!selectedBrand ? 'Новый Бренд' : !selectedModel ? 'Новая Модель' : 'Новое Поколение'}
                        </label>
                        <input
                            value={newItemName}
                            onChange={e => setNewItemName(e.target.value)}
                            placeholder={!selectedBrand ? "Например: BMW" : !selectedModel ? "Например: X5" : "Например: I поколение (E53)"}
                            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                        />
                    </div>

                    {/* Доп поля только для поколений */}
                    {selectedBrand && selectedModel && (
                        <>
                            <div className="w-24">
                                <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Начало</label>
                                <input
                                    type="number"
                                    value={yearStart}
                                    onChange={e => setYearStart(e.target.value)}
                                    placeholder="1999"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                                />
                            </div>
                            <div className="w-24">
                                <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Конец</label>
                                <input
                                    type="number"
                                    value={yearEnd}
                                    onChange={e => setYearEnd(e.target.value)}
                                    placeholder="2006"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-white"
                                />
                            </div>
                        </>
                    )}

                    <button
                        onClick={handleCreate}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all h-[50px]"
                    >
                        Добавить
                    </button>
                </div>

                {/* СПИСОК ЭЛЕМЕНТОВ */}
                <div className="grid grid-cols-1 gap-3">
                    {items.length > 0 ? items.map(item => (
                        <div
                            key={item.id}
                            onClick={() => {
                                // Кликаем по строке чтобы провалиться внутрь (если это не последний уровень)
                                if (!selectedBrand) setSelectedBrand(item);
                                else if (!selectedModel) setSelectedModel(item);
                            }}
                            className={`
                                group flex justify-between items-center p-5 bg-[#1a1d26] rounded-2xl border border-gray-800/50 
                                transition-all hover:border-blue-500/50 cursor-pointer
                                ${selectedBrand && selectedModel ? 'cursor-default hover:border-gray-800/50' : ''} 
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    {item.name[0]}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    {/* Если это поколение, показываем годы */}
                                    {item.yearStart && (
                                        <p className="text-xs text-gray-500 font-bold mt-1">
                                            {item.yearStart} — {item.yearEnd || 'н.в.'}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Стрелочка (если можно провалиться глубже) */}
                                {(!selectedBrand || !selectedModel) && (
                                    <span className="text-gray-600 group-hover:translate-x-1 transition-transform">→</span>
                                )}

                                <button
                                    onClick={(e) => handleDelete(item.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                    title="Удалить"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 text-gray-500">
                            Список пуст. Добавьте первую запись.
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}