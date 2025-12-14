// client/src/pages/CreateAd.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../components/Tooltip';
import API from '../api/api'; // Предполагаемый импорт для отправки данных на ваш бэкенд
import { fetchAddressSuggestions } from '../api/geocoding';

// ⚙️ СПРАВОЧНИК ОПЦИЙ АВТОМОБИЛЯ (Для чекбоксов)
const commonOptions = [
    { label: 'Кондиционер', value: 'ac' },
    { label: 'Подогрев сидений', value: 'heated_seats' },
    { label: 'Камера заднего вида', value: 'camera' },
    { label: 'Парктроники', value: 'parking_sensors' },
    { label: 'Круиз-контроль', value: 'cruise_control' },
    { label: 'ABS/ESP', value: 'safety_system' },
];

export default function CreateAd({ user }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        year: '',
        price: '',
        mileage: '',
        fuel: 'petrol',
        gearbox: 'manual',
        vin: '',
        state: 'good',
        ptsNumber: '',
        ptsSeries: '',
        ptsOwners: 1,
        registered: true,
        description: '',
        address: '',
        address_lat: null,  // Координаты от 2ГИС
        address_lng: null,  // Координаты от 2ГИС
        contact: '',
        options: [],
    });
    const [files, setFiles] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);

    // 🌐 Debounce для автодополнения адреса (2ГИС)
    useEffect(() => {
        if (formData.address.length < 3) {
            setSuggestions([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            const results = await fetchAddressSuggestions(formData.address);
            setSuggestions(results);
            setShowSuggestions(true);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [formData.address]);


    // 🔄 Общий обработчик изменения полей
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'address') {
            // При изменении адреса сбрасываем координаты
            setShowSuggestions(true);
            setFormData(prev => ({
                ...prev,
                address: value,
                address_lat: null,
                address_lng: null
            }));
        }
        setFormError(null);
    };

    // ✅ Обработчик изменения опций (чекбоксы)
    const handleOptionChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            options: checked
                ? [...prev.options, value]
                : prev.options.filter(option => option !== value)
        }));
    };

    // 🌍 Обработчик выбора адреса из списка 2ГИС
    const handleSelectAddress = (suggestion) => {
        setShowSuggestions(false);
        setSuggestions([]);

        setFormData(prev => ({
            ...prev,
            address: suggestion.address,
            address_lat: suggestion.lat,
            address_lng: suggestion.lng,
        }));
    };

    // 🖼️ Обработчик загрузки файлов
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.slice(0, 10 - files.length);
        setFiles(prev => [...prev, ...newFiles]);
        e.target.value = null;
    };

    // 🗑️ Обработчик удаления файла
    const handleRemoveFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // 🚀 Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        if (!user) {
            setLoading(false);
            return setFormError('Необходимо авторизоваться для создания объявления.');
        }

        // ⚠️ Финальная проверка координат
        if (!formData.address_lat || !formData.address_lng) {
            setLoading(false);
            return setFormError('Пожалуйста, выберите точный адрес из списка предложений 2ГИС.');
        }

        // Подготовка FormData для отправки
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            const value = key === 'options' ? JSON.stringify(formData[key]) : formData[key];
            data.append(key, value);
        });
        files.forEach(file => {
            data.append('photos', file);
        });

        try {
            // ⚠️ Используйте ваш настроенный API клиент для отправки данных
            await API.post('/ads', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Объявление успешно создано и отправлено на модерацию!');
            navigate('/');
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Произошла ошибка при создании объявления.';
            setFormError(errorMessage);
            console.error("Submission error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl mt-10 mb-20">
            <h1 className="text-3xl font-extrabold text-white mb-8 border-b-2 border-blue-600 pb-2">
                Разместить объявление
            </h1>

            {formError && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4 font-inter">
                    {formError}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* 1. Заголовок */}
                <div className="mb-6">
                    <Tooltip content="Краткое и привлекательное описание вашего объявления.">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Заголовок объявления</label>
                    </Tooltip>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 font-inter" placeholder="Например: Надежный VW Polo в идеальном состоянии" required />
                </div>

                {/* 2. Цена, Пробег, Год */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Цена (₽)</label>
                        <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500" placeholder="0" min="1"/>
                    </div>
                    <div>
                        <label htmlFor="mileage" className="block text-sm font-medium text-gray-300 mb-1">Пробег (км)</label>
                        <input type="number" id="mileage" name="mileage" value={formData.mileage} onChange={handleChange} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500" placeholder="0" min="0"/>
                    </div>
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">Год</label>
                        <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500" placeholder="2020" min="1900" max={new Date().getFullYear() + 1}/>
                    </div>
                </div>

                {/* 3. Топливо, КПП, VIN */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="fuel" className="block text-sm font-medium text-gray-300 mb-1">Топливо</label>
                        <select id="fuel" name="fuel" value={formData.fuel} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500">
                            <option value="petrol">Бензин</option>
                            <option value="diesel">Дизель</option>
                            <option value="electric">Электро</option>
                            <option value="hybrid">Гибрид</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="gearbox" className="block text-sm font-medium text-gray-300 mb-1">КПП</label>
                        <select id="gearbox" name="gearbox" value={formData.gearbox} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500">
                            <option value="manual">Механика</option>
                            <option value="automatic">Автомат</option>
                            <option value="robot">Робот</option>
                            <option value="cvt">Вариатор</option>
                        </select>
                    </div>
                    <div>
                        <Tooltip content="Идентификационный номер автомобиля (17 символов).">
                            <label htmlFor="vin" className="block text-sm font-medium text-gray-300 mb-1">VIN</label>
                        </Tooltip>
                        <input type="text" id="vin" name="vin" value={formData.vin} onChange={handleChange} maxLength="17" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500" placeholder="WBA..." required/>
                    </div>
                </div>

                {/* 4. Данные ПТС */}
                <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
                    <h3 className="text-lg font-bold text-white mb-3">Данные ПТС</h3>
                    <div className="grid grid-cols-4 gap-4">
                        <div>
                            <Tooltip content="Серия паспорта транспортного средства (4 символа).">
                                <label htmlFor="ptsSeries" className="block text-sm font-medium text-gray-300 mb-1">Серия</label>
                            </Tooltip>
                            <input type="text" id="ptsSeries" name="ptsSeries" value={formData.ptsSeries} onChange={handleChange} maxLength="4" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white uppercase" placeholder="XXYY"/>
                        </div>
                        <div className="col-span-2">
                            <Tooltip content="Номер паспорта транспортного средства (10 символов).">
                                <label htmlFor="ptsNumber" className="block text-sm font-medium text-gray-300 mb-1">Номер</label>
                            </Tooltip>
                            <input type="text" id="ptsNumber" name="ptsNumber" value={formData.ptsNumber} onChange={handleChange} maxLength="10" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white" placeholder="1234567890"/>
                        </div>
                        <div>
                            <Tooltip content="Число владельцев по ПТС.">
                                <label htmlFor="ptsOwners" className="block text-sm font-medium text-gray-300 mb-1">Владельцев</label>
                            </Tooltip>
                            <input type="number" id="ptsOwners" name="ptsOwners" value={formData.ptsOwners} onChange={handleChange} min="1" max="10" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"/>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="inline-flex items-center text-gray-200 cursor-pointer font-inter">
                            <input
                                type="checkbox"
                                name="registered"
                                checked={formData.registered}
                                onChange={handleChange}
                            />
                            Автомобиль на учете в ГИБДД
                        </label>
                    </div>
                </div>

                {/* 5. Состояние */}
                <div className="mb-6">
                    <Tooltip content="Техническое состояние автомобиля (для фильтров).">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Состояние</label>
                    </Tooltip>
                    <div className="flex space-x-6">
                        <label className="inline-flex items-center text-gray-200 cursor-pointer font-inter">
                            <input type="radio" name="state" value="good" checked={formData.state === 'good'} onChange={handleChange} />
                            Отличное / Не битый
                        </label>
                        <label className="inline-flex items-center text-gray-200 cursor-pointer font-inter">
                            <input type="radio" name="state" value="damaged" checked={formData.state === 'damaged'} onChange={handleChange} />
                            Требует ремонта / Битый
                        </label>
                    </div>
                </div>

                {/* 6. Опции */}
                <div className="mb-6">
                    <Tooltip content="Выберите основные дополнительные опции, установленные в автомобиле.">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Опции и комфорт</label>
                    </Tooltip>
                    <div className="grid grid-cols-2 gap-3">
                        {commonOptions.map((option) => (
                            <label key={option.value} className="inline-flex items-center text-gray-200 cursor-pointer font-inter">
                                <input
                                    type="checkbox"
                                    name="options"
                                    value={option.value}
                                    checked={formData.options.includes(option.value)}
                                    onChange={handleOptionChange}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* 7. Описание */}
                <div className="mb-6">
                    <Tooltip content="Подробно опишите преимущества, историю обслуживания и любые особенности вашего автомобиля.">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Описание</label>
                    </Tooltip>
                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 font-inter resize-none" placeholder="Опишите ваш автомобиль" required />
                </div>

                {/* 8. Адрес (Геокодинг 2ГИС) */}
                <div className="mb-6 relative">
                    <Tooltip content="Выберите точный адрес из списка 2ГИС, чтобы правильно разместить метку на карте.">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">Адрес осмотра</label>
                    </Tooltip>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        onFocus={() => { if (formData.address.length >= 3 && suggestions.length > 0) setShowSuggestions(true); }}
                        onBlur={() => { setTimeout(() => setShowSuggestions(false), 200); }}
                        className={`w-full p-3 bg-gray-700 border rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 font-inter ${!formData.address_lat && formData.address ? 'border-yellow-500' : 'border-gray-600'}`}
                        placeholder="Введите город, улицу и дом (обязательно выберите из списка)"
                        required
                    />

                    {/* Индикатор статуса геокодирования */}
                    {formData.address && !formData.address_lat && (
                        <p className="text-sm text-yellow-400 mt-2 font-inter">
                            ⚠️ Выберите точный адрес из выпадающего списка 2ГИС!
                        </p>
                    )}

                    {/* Выпадающий список предложений 2ГИС */}
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-30 w-full bg-gray-700 border border-blue-600 rounded-b-lg mt-0 max-h-60 overflow-y-auto shadow-2xl custom-scrollbar">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.id}
                                    onMouseDown={() => handleSelectAddress(suggestion)}
                                    className="p-3 text-gray-200 hover:bg-blue-600 hover:text-white cursor-pointer transition duration-150 font-inter border-b border-gray-600 last:border-b-0"
                                >
                                    {suggestion.address}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* 9. Контакт */}
                <div className="mb-6">
                    <Tooltip content="Ваш номер телефона для связи с потенциальными покупателями.">
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-300 mb-1">Контактный телефон</label>
                    </Tooltip>
                    <input type="tel" id="contact" name="contact" value={formData.contact} onChange={handleChange} maxLength="18" className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500" placeholder="+7 (XXX) XXX-XX-XX" required/>
                </div>

                {/* 10. Загрузка Фото (Кастомный дизайн) */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Фотографии автомобиля ({files.length} / 10 шт.)
                    </label>

                    {/* Кастомная область загрузки */}
                    <label
                        htmlFor="file-upload"
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition duration-200 p-4 ${files.length >= 10 ? 'bg-gray-800 border-gray-700 cursor-not-allowed opacity-50' : 'bg-gray-700 border-gray-600 hover:bg-gray-700/70'}`}
                    >
                        <svg className="w-8 h-8 text-blue-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                        <p className="text-sm text-gray-400 font-inter">
                            <span className="font-semibold text-blue-400 hover:text-blue-300 transition">Нажмите, чтобы загрузить</span>
                            &nbsp;или перетащите файлы сюда
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 font-inter">JPEG, PNG (макс. 10 шт.)</p>
                    </label>

                    <input id="file-upload" type="file" name="photos" onChange={handleFileChange} className="hidden" multiple accept="image/jpeg, image/png" disabled={files.length >= 10}/>
                </div>

                {/* 11. Предварительный просмотр загруженных файлов */}
                {files.length > 0 && (
                    <div className="mb-6 border-t border-gray-700 pt-4">
                        <p className="text-sm font-medium text-gray-400 mb-3 font-inter">Предварительный просмотр:</p>
                        <div className="flex flex-wrap gap-3">
                            {files.map((file, index) => (
                                <div key={index} className="relative h-20 w-20 rounded-lg overflow-hidden border border-gray-600 shadow-md">
                                    <img src={URL.createObjectURL(file)} alt={`Фото ${index + 1}`} className="h-full w-full object-cover"/>
                                    <button type="button" onClick={() => handleRemoveFile(index)} className="absolute top-0 right-0 p-1 bg-red-600/80 hover:bg-red-700 text-white rounded-bl-lg transition" title="Удалить фото">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 12. Кнопка отправки */}
                <button
                    type="submit"
                    className="w-full p-3 mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition duration-200 disabled:bg-gray-500"
                    disabled={loading || files.length === 0 || !formData.address_lat}
                >
                    {loading ? 'Публикация...' : 'Опубликовать объявление'}
                </button>
            </form>
        </div>
    );
}