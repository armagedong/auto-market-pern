import React, { useState, useEffect } from 'react';
import API from '../../api/api';

export default function CatalogManager() {
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedModel, setSelectedModel] = useState(null);
    const [items, setItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [yearStart, setYearStart] = useState('');
    const [yearEnd, setYearEnd] = useState('');

    useEffect(() => {
        fetchData();
    }, [selectedBrand, selectedModel]);

    const fetchData = async () => {
        try {
            setItems([]);
            let res;
            if (!selectedBrand) res = await API.get('/brands');
            else if (!selectedModel) res = await API.get(`/brands/${selectedBrand.id}/models`);
            else res = await API.get(`/brands/models/${selectedModel.id}/generations`);
            setItems(res.data);
        } catch (err) { console.error(err); }
    };

    const handleCreate = async () => {
        if (!newItemName) return;
        try {
            if (!selectedBrand) await API.post('/brands', { name: newItemName });
            else if (!selectedModel) await API.post('/brands/models', { name: newItemName, brandId: selectedBrand.id });
            else await API.post('/brands/generations', { name: newItemName, modelId: selectedModel.id, yearStart, yearEnd });
            setNewItemName(''); setYearStart(''); setYearEnd('');
            fetchData();
        } catch (err) { alert("Ошибка создания"); }
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (!window.confirm("Удалить?")) return;
        try {
            let url = !selectedBrand ? `/brands/${id}` : !selectedModel ? `/brands/models/${id}` : `/brands/generations/${id}`;
            await API.delete(url);
            fetchData();
        } catch (err) { alert("Ошибка удаления"); }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* ХЛЕБНЫЕ КРОШКИ */}
            <div className="flex items-center gap-2 mb-8 text-xl font-bold">
                <button onClick={() => { setSelectedBrand(null); setSelectedModel(null); }} className={`hover:text-blue-500 ${!selectedBrand ? 'text-white' : 'text-gray-500'}`}>Все Бренды</button>
                {selectedBrand && <><span className="text-gray-600">/</span><button onClick={() => setSelectedModel(null)} className={`hover:text-blue-500 ${!selectedModel ? 'text-white' : 'text-gray-500'}`}>{selectedBrand.name}</button></>}
                {selectedModel && <><span className="text-gray-600">/</span><span className="text-white">{selectedModel.name}</span></>}
            </div>

            {/* ФОРМА */}
            <div className="bg-[#1a1d26] p-6 rounded-2xl border border-gray-800 mb-8 flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Название..." className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500" />
                </div>
                {selectedBrand && selectedModel && (
                    <><div className="w-24"><input type="number" value={yearStart} onChange={e => setYearStart(e.target.value)} placeholder="От" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3" /></div>
                        <div className="w-24"><input type="number" value={yearEnd} onChange={e => setYearEnd(e.target.value)} placeholder="До" className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3" /></div></>
                )}
                <button onClick={handleCreate} className="bg-blue-600 px-8 py-3 rounded-xl font-black uppercase text-xs h-[50px]">Добавить</button>
            </div>

            {/* СПИСОК */}
            <div className="grid grid-cols-1 gap-3">
                {items.map(item => (
                    <div key={item.id} onClick={() => { if (!selectedBrand) setSelectedBrand(item); else if (!selectedModel) setSelectedModel(item); }} className="group flex justify-between items-center p-5 bg-[#1a1d26] rounded-2xl border border-gray-800/50 hover:border-blue-500/50 cursor-pointer">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center font-bold">{item.name[0]}</div>
                            <h3 className="font-bold text-lg">{item.name}</h3>
                        </div>
                        <button onClick={(e) => handleDelete(item.id, e)} className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-500/10 rounded-lg">🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    );
}