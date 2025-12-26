import React, { useState } from 'react';
import CatalogManager from '../components/admin/CatalogManager';
import ModerationManager from '../components/admin/ModerationManager';

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('moderation');

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white pt-24 px-4 pb-20">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-black uppercase italic italic tracking-tighter">
                        ADMIN<span className="text-blue-500">PANEL</span>
                    </h1>

                    <div className="flex bg-[#1a1d26] p-1.5 rounded-2xl border border-gray-800">
                        <button
                            onClick={() => setActiveTab('moderation')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'moderation' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500'}`}
                        >
                            Модерация
                        </button>
                        <button
                            onClick={() => setActiveTab('catalog')}
                            className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === 'catalog' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500'}`}
                        >
                            Каталог
                        </button>
                    </div>
                </div>

                {/* Тут происходит магия переключения */}
                {activeTab === 'moderation' ? <ModerationManager /> : <CatalogManager />}
            </div>
        </div>
    );
}