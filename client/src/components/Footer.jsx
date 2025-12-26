import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const companyInfo = {
    name: "AUTOSITE",
    description: "Надежная платформа для покупки и продажи проверенных автомобилей с гарантией чистоты сделки.",
    email: "armankanturleev6551@gmail.com",
    phone: "+7 (950) 189-38-81",
    address: "Чкалова 11"
};

const navLinks = [
    { title: "Купить авто", to: "/" },
    { title: "Продать авто", to: "/create" },
    { title: "Избранное", to: "/profile" },
    { title: "О нас", to: "/about" },
];

const legalLinks = [
    { title: "Соглашение", to: "/terms" },
    { title: "Приватность", to: "/privacy" },
    { title: "Правила", to: "/rules" },
];

export default function Footer({user}) {


    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0f1117] border-t border-gray-800 pt-16 pb-8 mt-20">
            <div className="max-w-[1300px] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* 1. ЛОГОТИП И ИНФО */}
                    <div className="space-y-6">
                        <Link to="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-2">
                            <span className="text-blue-500">AUTO</span>SITE
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {companyInfo.description}
                        </p>
                        <div className="flex gap-4">
                            {/* Иконки соцсетей (простые круги для стиля) */}
                            {['TG'].map(social => (
                                <a key={social} href="https://t.me/kanturleev" className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xs font-bold hover:bg-blue-600 transition-all">
                                    {social}
                                </a>
                            ))}
                            {['VK'].map(social => (
                                <a key={social} href="https://vk.com/armaggedeon" className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xs font-bold hover:bg-blue-600 transition-all">
                                    {social}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 2. НАВИГАЦИЯ */}
                    <div>
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Навигация</h4>
                        <ul className="space-y-4">
                            {navLinks.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.to} className="text-gray-500 hover:text-blue-500 transition-colors text-sm font-medium">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. ПРАВОВАЯ ИНФОРМАЦИЯ */}
                    <div>
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-6">Юридическая часть</h4>
                        <ul className="space-y-4">
                            {legalLinks.map((item, index) => (
                                <li key={index}>
                                    <Link to={item.to} className="text-gray-500 hover:text-blue-500 transition-colors text-sm font-medium">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>


                </div>

                {/* НИЖНЯЯ ПАНЕЛЬ */}
                <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold uppercase tracking-widest text-gray-600">
                    <div>
                        © {currentYear} {companyInfo.name}. Сделано для людей.
                    </div>
                    <div className="flex gap-8">
                        <span className="hover:text-gray-400 cursor-pointer transition-colors">8 (950) 189-38-81</span>
                        <span className="hover:text-gray-400 cursor-pointer transition-colors">armankanturleev6551@gmail.com</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}