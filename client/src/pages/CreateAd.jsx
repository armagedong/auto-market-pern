// client/src/pages/CreateAd.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tooltip from '../components/Tooltip';
import Dropdown from '../components/Dropdown'; // Импортируем новый компонент
import API from '../api/api'; // Ваш настроенный клиент axios
import { fetchAddressSuggestions } from '../api/geocoding'; // Убедитесь, что этот файл существует

// ⚙️ СПРАВОЧНИК ОПЦИЙ АВТОМОБИЛЯ
const commonOptions = [
    { label: 'Кондиционер', value: 'ac' },
    { label: 'Подогрев сидений', value: 'heated_seats' },
    { label: 'Камера заднего вида', value: 'camera' },
    { label: 'Парктроники', value: 'parking_sensors' },
    { label: 'Круиз-контроль', value: 'cruise_control' },
    { label: 'ABS/ESP', value: 'safety_system' },
];

// -----------------------------------------------------------
// 🌐 ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ФОРМАТИРОВАНИЯ
// -----------------------------------------------------------

/**
 * Форматирует чистое числовое значение, добавляя пробелы для разделения сотен.
 * @param {string | number} value - Числовое значение.
 * @returns {string} Форматированная строка (например, "1 000 000").
 */
const formatNumberWithSpaces = (value) => {
    if (value === null || value === undefined || value === '') return '';
    // Преобразуем в строку, убираем нецифровые символы и форматируем
    return String(value)
        .replace(/\D/g, '') // Убираем все, кроме цифр
        .replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Добавляем пробелы
};

/**
 * Применяет маску номера телефона: +7 (XXX) XXX-XX-XX.
 * @param {string} value - Введенное пользователем значение.
 * @returns {string} Форматированный номер.
 */
const formatPhoneNumber = (value) => {
    // 1. Убираем все, кроме цифр
    const digits = value.replace(/\D/g, '');

    // 2. Если длина 0, возвращаем пустую строку
    if (digits.length === 0) return '';

    // 3. Обрабатываем префикс
    let formatted = '+7';
    let index = 0;

    // Игнорируем начальные 7 или 8
    if (digits.startsWith('8') || digits.startsWith('7')) {
        index = 1;
    }

    // 4. Форматируем остальную часть
    const phoneDigits = digits.substring(index);

    if (phoneDigits.length > 0) {
        formatted += ' (';

        // Код города (3 цифры)
        formatted += phoneDigits.substring(0, 3);

        // Разделение
        if (phoneDigits.length > 3) {
            formatted += ') ' + phoneDigits.substring(3, 6);
        }

        // Разделение
        if (phoneDigits.length > 6) {
            formatted += '-' + phoneDigits.substring(6, 8);
        }

        // Разделение
        if (phoneDigits.length > 8) {
            formatted += '-' + phoneDigits.substring(8, 10);
        }
    }

    // Ограничиваем общую длину ввода маской +7 (XXX) XXX-XX-XX (это 18 символов)
    return formatted.substring(0, 18);
};


// -----------------------------------------------------------
// 🌐 ФУНКЦИИ ДЛЯ ЗАГРУЗКИ СПРАВОЧНИКОВ ИЗ API
// -----------------------------------------------------------

const fetchBrands = async () => {
    try {
        const response = await API.get('/brands');
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке марок:", error);
        return [];
    }
};

const fetchModelsByBrand = async (brandId) => {
    if (!brandId) return [];
    try {
        const response = await API.get(`/models?brand_id=${brandId}`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при загрузке моделей для марки ${brandId}:`, error);
        return [];
    }
};

const fetchGenerationsByModel = async (modelId) => {
    if (!modelId) return [];
    try {
        const response = await API.get(`/generations?model_id=${modelId}`);
        return response.data;
    } catch (error) {
        console.error(`Ошибка при загрузке поколений для модели ${modelId}:`, error);
        return [];
    }
};

const fetchColors = async () => {
    try {
        const response = await API.get('/colors');
        return response.data;
    } catch (error) {
        console.error("Ошибка при загрузке цветов:", error);
        return [];
    }
};


export default function CreateAd({ user }) {
    const navigate = useNavigate();

    // СТЕЙТЫ СПРАВОЧНИКОВ
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [generations, setGenerations] = useState([]);
    const [colors, setColors] = useState([]);
    const [catalogLoading, setCatalogLoading] = useState(true);

    // СТЕЙТЫ ДЛЯ ВИЗУАЛЬНОГО ФОРМАТИРОВАНИЯ (с пробелами)
    const [formattedPrice, setFormattedPrice] = useState('');
    const [formattedMileage, setFormattedMileage] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        brandId: null,
        model: '',
        modelId: null,
        generation: '',
        generationId: null,
        colorId: null,
        year: '',
        price: '', // Хранит чистое число для отправки
        mileage: '', // Хранит чистое число для отправки
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
        address_lat: null,
        address_lng: null,
        contact: '', // Хранит форматированную строку (+7 (XXX)...)
        options: [],
    });
    const [files, setFiles] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState(null);


    // -----------------------------------------------------------
    // 🔄 ЭФФЕКТЫ ЗАГРУЗКИ КАТАЛОГА (Зависимая загрузка)
    // -----------------------------------------------------------

    // 1. Загрузка Марков и Цветов
    useEffect(() => {
        const loadInitialCatalog = async () => {
            try {
                const [brandsData, colorsData] = await Promise.all([
                    fetchBrands(),
                    fetchColors()
                ]);
                setBrands(brandsData);
                setColors(colorsData);
            } catch (error) {
                setFormError('Не удалось загрузить справочные данные (марки/цвета).');
            } finally {
                setCatalogLoading(false);
            }
        };
        loadInitialCatalog();
    }, []);

    // 2. Загрузка Моделей
    useEffect(() => {
        const loadModels = async () => {
            if (formData.brandId) {
                const modelsData = await fetchModelsByBrand(formData.brandId);
                setModels(modelsData);
            } else {
                setModels([]);
            }
        };
        loadModels();
    }, [formData.brandId]);

    // 3. Загрузка Поколений
    useEffect(() => {
        const loadGenerations = async () => {
            if (formData.modelId) {
                const generationsData = await fetchGenerationsByModel(formData.modelId);
                setGenerations(generationsData);
            } else {
                setGenerations([]);
            }
        };
        loadGenerations();
    }, [formData.modelId]);

    // 4. Debounce для адреса 2ГИС
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


    // -----------------------------------------------------------
    // 📝 ОБРАБОТЧИКИ ФОРМ
    // -----------------------------------------------------------

    // 5. Общий обработчик изменения полей (для строковых и числовых ID)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let update = { [name]: type === 'checkbox' ? checked : value };

        // Логика сброса и сохранения ID для каталога
        if (name === 'brand') {
            const selectedBrand = brands.find(b => b.name === value);
            update = {
                ...update,
                brandId: selectedBrand ? selectedBrand.id : null,
                model: '',
                modelId: null,
                generation: '',
                generationId: null
            };
        } else if (name === 'model') {
            const selectedModel = models.find(m => m.name === value);
            update = {
                ...update,
                modelId: selectedModel ? selectedModel.id : null,
                generation: '',
                generationId: null
            };
        } else if (name === 'generation') {
            const selectedGeneration = generations.find(g => g.name === value);
            update = {
                ...update,
                generationId: selectedGeneration ? selectedGeneration.id : null
            };
        } else if (name === 'colorId') {
            update = { [name]: value ? parseInt(value) : null };
        } else if (name === 'address') {
            update = { ...update, address_lat: null, address_lng: null };
            setShowSuggestions(true);
        }

        setFormData(prev => ({ ...prev, ...update }));
        setFormError(null);
    };

    // 6. 💸 Обработчик для Цены и Пробега (с форматированием пробелами)
    const handleNumberChange = (e, stateUpdater) => {
        const { name, value } = e.target;
        // Убираем все, кроме цифр, для чистого стейта
        const cleanValue = value.replace(/\D/g, '');

        // Обновляем чистый стейт formData (для отправки на бэкенд)
        setFormData(prev => ({
            ...prev,
            [name]: cleanValue ? parseInt(cleanValue) : ''
        }));

        // Обновляем форматированный стейт (для отображения в поле)
        stateUpdater(formatNumberWithSpaces(cleanValue));
        setFormError(null);
    };

    // 7. 📞 Обработчик для форматирования номера телефона
    const handlePhoneChange = (e) => {
        const rawValue = e.target.value;
        const formattedValue = formatPhoneNumber(rawValue);

        setFormData(prev => ({
            ...prev,
            contact: formattedValue
        }));
        setFormError(null);
    };

    // ... (остальные обработчики: handleOptionChange, handleSelectAddress, handleFileChange, handleRemoveFile)
    const handleOptionChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            options: checked
                ? [...prev.options, value]
                : prev.options.filter(option => option !== value)
        }));
    };

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

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const newFiles = selectedFiles.slice(0, 10 - files.length);
        setFiles(prev => [...prev, ...newFiles]);
        e.target.value = null;
    };

    const handleRemoveFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    // 8. 🚀 Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormError(null);

        // ⚠️ ПРОВЕРКИ ОБЯЗАТЕЛЬНЫХ ID
        if (!user || !user.id) {
            setLoading(false);
            return setFormError('Ошибка: Вы не авторизованы (отсутствует userId).');
        }
        if (!formData.brandId || !formData.modelId) {
            setLoading(false);
            return setFormError('Ошибка: Не выбрана Марка или Модель автомобиля.');
        }
        if (!formData.colorId) {
            setLoading(false);
            return setFormError('Пожалуйста, выберите цвет автомобиля.');
        }
        if (generations.length > 0 && !formData.generationId) {
            setLoading(false);
            return setFormError('Пожалуйста, выберите Поколение автомобиля.');
        }
        if (!formData.address_lat || !formData.address_lng) {
            setLoading(false);
            return setFormError('Пожалуйста, выберите точный адрес из списка предложений 2ГИС.');
        }
        if (files.length === 0) {
            setLoading(false);
            return setFormError('Пожалуйста, загрузите хотя бы одну фотографию.');
        }

        // Подготовка FormData для отправки
        const data = new FormData();
        data.append('userId', user.id);

        Object.keys(formData).forEach(key => {
            if (key === 'options') {
                data.append(key, JSON.stringify(formData[key]));
            } else if (['brand', 'model', 'generation'].includes(key)) {
                // Игнорируем строковые названия
                return;
            } else {
                // Отправляем все остальные поля, включая чистые числа (price, mileage) и все ID
                data.append(key, formData[key] === null ? '' : formData[key]);
            }
        });

        files.forEach(file => {
            data.append('photos', file);
        });

        try {
            console.log('--- FormData to be sent:');
            for (var pair of data.entries()) {
                console.log(pair[0]+ ': ' + pair[1]);
            }

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

    // ⛔️ Если каталог еще загружается
    if (catalogLoading) {
        return (
            <div className="max-w-xl mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl mt-10 mb-20 text-center text-white">
                Загрузка данных каталога...
            </div>
        );
    }

    // 📱 Меню быстрых действий для фото
    const photoActions = [
        { label: 'Удалить все фото', action: () => setFiles([]) },
        { label: 'Сортировать по имени', action: () => setFiles([...files].sort((a, b) => a.name.localeCompare(b.name))) },
        { label: 'Проверить размеры', action: () => {
                const oversized = files.filter(f => f.size > 5 * 1024 * 1024);
                if (oversized.length > 0) {
                    alert(`${oversized.length} файлов превышают 5MB`);
                }
            }},
    ];

    // 📱 Дополнительные опции для быстрого выбора
    const quickOptions = [
        { label: 'Все опции', value: 'all', action: () => {
                setFormData(prev => ({
                    ...prev,
                    options: commonOptions.map(o => o.value)
                }));
            }},
        { label: 'Только премиум', value: 'premium', action: () => {
                setFormData(prev => ({
                    ...prev,
                    options: ['ac', 'heated_seats', 'cruise_control']
                }));
            }},
        { label: 'Очистить все', value: 'clear', action: () => {
                setFormData(prev => ({ ...prev, options: [] }));
            }},
    ];

    return (
        <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl mt-10 mb-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-white border-b-2 border-blue-600 pb-2">
                    Разместить объявление
                </h1>

                {/* Пример использования Dropdown для быстрых действий */}
                <Dropdown
                    items={[
                        { label: 'Сохранить черновик', action: () => alert('Черновик сохранен') },
                        { label: 'Предпросмотр', action: () => alert('Режим предпросмотра') },
                        { type: 'divider' },
                        { label: 'Справка', action: () => window.open('/help', '_blank') },
                    ]}
                    onSelect={(item) => item.action && item.action()}
                    width="w-48"
                >
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center">
                        Действия
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </Dropdown>
            </div>

            {formError && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4 font-inter">
                    {formError}
                </div>
            )}

            <form onSubmit={handleSubmit}>

                {/* 1. БЛОК: МАРКА, МОДЕЛЬ, ПОКОЛЕНИЕ */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Марка */}
                    <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-1">Марка</label>
                        <select
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            required
                        >
                            <option value="" disabled>Выберите марку</option>
                            {brands.map(b => (
                                <option key={b.id} value={b.name}>{b.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Модель */}
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-1">Модель</label>
                        <select
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            required
                            disabled={!formData.brandId}
                        >
                            <option value="" disabled>Выберите модель</option>
                            {models.map(m => (
                                <option key={m.id} value={m.name}>{m.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Поколение */}
                    <div>
                        <Tooltip content="Укажите поколение или кузов вашего автомобиля для точной идентификации.">
                            <label htmlFor="generation" className="block text-sm font-medium text-gray-300 mb-1">Поколение</label>
                        </Tooltip>
                        <select
                            id="generation"
                            name="generation"
                            value={formData.generation}
                            onChange={handleChange}
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                            required={generations.length > 0}
                            disabled={!formData.modelId || generations.length === 0}
                        >
                            <option value="" disabled>Выберите поколение</option>
                            {generations.map(g => (
                                <option key={g.id} value={g.name}>{g.name}</option>
                            ))}
                        </select>
                        {generations.length === 0 && formData.modelId && (
                            <p className="text-xs text-yellow-400 mt-1">Поколения для этой модели пока недоступны.</p>
                        )}
                    </div>
                </div>

                {/* 2. БЛОК: ЦВЕТ */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                        <label htmlFor="colorId" className="block text-sm font-medium text-gray-300">Цвет</label>

                        {/* Дополнительные опции для цветов через Dropdown */}
                        <Dropdown
                            trigger="hover"
                            items={[
                                { label: 'Показать все цвета', action: () => {} },
                                { label: 'Только популярные', action: () => {} },
                            ]}
                            width="w-40"
                            position="bottom"
                        >
                            <span className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Еще
                            </span>
                        </Dropdown>
                    </div>

                    <select
                        id="colorId"
                        name="colorId"
                        value={formData.colorId || ''}
                        onChange={handleChange}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="" disabled>Выберите цвет</option>
                        {colors.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>

                    {/* Визуальный индикатор цвета (если в БД есть поле 'hex') */}
                    {formData.colorId && colors.find(c => c.id == formData.colorId && c.hex) && (
                        <div className="mt-2 text-sm text-gray-400 flex items-center">
                            Выбранный цвет:
                            <span
                                className="ml-2 w-4 h-4 rounded-full border border-gray-500"
                                style={{ backgroundColor: colors.find(c => c.id == formData.colorId).hex }}
                            ></span>
                        </div>
                    )}
                </div>

                {/* 3. Заголовок */}
                <div className="mb-6">
                    <Tooltip content="Краткое и привлекательное описание вашего объявления.">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Заголовок объявления</label>
                    </Tooltip>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 font-inter" placeholder="Например: Надежный VW Polo в идеальном состоянии" required />
                </div>

                {/* 4. Цена, Пробег, Год */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">Цена (₽)</label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            value={formattedPrice}
                            onChange={(e) => handleNumberChange(e, setFormattedPrice)}
                            required
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="mileage" className="block text-sm font-medium text-gray-300 mb-1">Пробег (км)</label>
                        <input
                            type="text"
                            id="mileage"
                            name="mileage"
                            value={formattedMileage}
                            onChange={(e) => handleNumberChange(e, setFormattedMileage)}
                            required
                            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="year" className="block text-sm font-medium text-gray-300 mb-1">Год</label>
                        <input type="number" id="year" name="year" value={formData.year} onChange={handleChange} required className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500" placeholder="2020" min="1900" max={new Date().getFullYear() + 1}/>
                    </div>
                </div>

                {/* 5. Топливо, КПП, VIN */}
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

                {/* 6. Данные ПТС */}
                <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-900/50">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold text-white">Данные ПТС</h3>

                        <Tooltip content="Проверьте корректность данных ПТС перед публикацией">
                            <Dropdown
                                trigger="click"
                                items={[
                                    { label: 'Проверить ПТС онлайн', action: () => window.open('https://проверка-птс.рф', '_blank') },
                                    { label: 'Как заполнять ПТС?', action: () => alert('Инструкция по заполнению') },
                                ]}
                                width="w-56"
                            >
                            </Dropdown>
                        </Tooltip>
                    </div>

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

                {/* 7. Состояние */}
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

                {/* 8. Опции */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <Tooltip content="Выберите основные дополнительные опции, установленные в автомобиле.">
                            <label className="block text-sm font-medium text-gray-300">Опции и комфорт</label>
                        </Tooltip>

                        {/* Dropdown для быстрого выбора опций */}
                        <Dropdown
                            items={quickOptions}
                            onSelect={(item) => item.action && item.action()}
                            width="w-48"
                        >
                            <button
                                type="button"
                                className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center"
                            >
                                Быстрый выбор
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </Dropdown>
                    </div>

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

                {/* 9. Описание */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-1">
                        <Tooltip content="Подробно опишите преимущества, историю обслуживания и любые особенности вашего автомобиля.">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Описание</label>
                        </Tooltip>

                        <span className="text-xs text-gray-500">
                            {formData.description.length}/2000 символов
                        </span>
                    </div>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500 font-inter resize-none"
                        placeholder="Опишите ваш автомобиль"
                        maxLength="2000"
                        required
                    />
                </div>

                {/* 10. Адрес (Геокодинг 2ГИС) */}
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

                {/* 11. Контакт (С маской) */}
                <div className="mb-6">
                    <Tooltip content="Ваш номер телефона для связи с потенциальными покупателями.">
                        <label htmlFor="contact" className="block text-sm font-medium text-gray-300 mb-1">Контактный телефон</label>
                    </Tooltip>
                    <input
                        type="tel"
                        id="contact"
                        name="contact"
                        value={formData.contact}
                        onChange={handlePhoneChange} // ⬅️ Используем обработчик с маской
                        maxLength="18"
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="+7 (XXX) XXX-XX-XX"
                        required
                    />
                </div>

                {/* 12. Загрузка Фото */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-300">
                            Фотографии автомобиля ({files.length} / 10 шт.)
                        </label>

                        {/* Dropdown для управления фото */}
                        {files.length > 0 && (
                            <Dropdown
                                items={photoActions}
                                onSelect={(item) => item.action && item.action()}
                                width="w-52"
                            >
                                <button
                                    type="button"
                                    className="text-xs px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center"
                                >
                                    Управление фото
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                            </Dropdown>
                        )}
                    </div>

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

                {/* 13. Предварительный просмотр загруженных файлов */}
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

                {/* 14. Кнопка отправки */}
                <div className="flex gap-4 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="flex-1 p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition duration-200"
                    >
                        Отмена
                    </button>

                    <button
                        type="submit"
                        className="flex-1 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-bold transition duration-200 disabled:bg-gray-500"
                        disabled={
                            loading ||
                            files.length === 0 ||
                            !formData.address_lat ||
                            !formData.brandId ||
                            !formData.modelId ||
                            !formData.colorId ||
                            (generations.length > 0 && !formData.generationId)
                        }
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Публикация...
                            </span>
                        ) : 'Опубликовать объявление'}
                    </button>
                </div>
            </form>
        </div>
    );
}