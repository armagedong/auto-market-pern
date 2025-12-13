import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

export default function CreateAd({ user }) {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [colors, setColors] = useState([]); // <-- Теперь цвета загружаются
    const [selectedBrandId, setSelectedBrandId] = useState('');

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            title: '',
            brandId: '',
            modelId: '',
            colorId: '', // Используем colorId
            year: new Date().getFullYear(),
            mileage: 0,
            price: 0,
            fuel: 'Бензин',
            gearbox: 'Автомат',
            vin: '',
            state: 'good',
            ptsNumber: '',
            ptsSeries: '',
            ptsOwners: 1,
            registered: 'false',
            description: '',
            address: '',
            contact: '',
            options: [],
            photos: [],
        }
    });

    const photosWatch = watch('photos');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!user && !token) {
            alert('Вы должны войти в систему');
            navigate('/login');
        }

        fetchBrands();
        fetchColors(); // <-- Вызываем загрузку цветов
    }, [user, navigate]);

    /**
     * @summary Загружает список брендов.
     */
    const fetchBrands = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/brands');
            setBrands(res.data);
        } catch (err) {
            console.error('Ошибка загрузки брендов:', err);
        }
    };

    /**
     * @summary Загружает список цветов.
     */
    const fetchColors = async () => {
        try {
            // Предполагаем, что у вас есть роут /api/colors, который возвращает все цвета
            const res = await axios.get('http://localhost:4000/api/colors');
            setColors(res.data);
        } catch (err) {
            console.error('Ошибка загрузки цветов:', err);
        }
    };

    /**
     * @summary Загружает список моделей для выбранного бренда.
     */
    const fetchModels = async (brandId) => {
        try {
            const res = await axios.get(`http://localhost:4000/api/models?brand_id=${brandId}`);
            setModels(res.data);
        } catch (err) {
            console.error('Ошибка загрузки моделей:', err);
        }
    };

    const handleBrandChange = (e) => {
        const brandId = e.target.value;
        setSelectedBrandId(brandId);
        setValue('brandId', brandId);
        setValue('modelId', '');
        setModels([]);
        if (brandId) {
            fetchModels(brandId);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();

            Object.keys(data).forEach((key) => {
                if (key === 'photos' && data.photos.length > 0) {
                    Array.from(data.photos).forEach((file) => formData.append('photos', file));
                } else if (key === 'options' && data.options.length > 0) {
                    data.options.forEach((opt) => formData.append('options', opt));
                } else if (key !== 'photos' && key !== 'options') {
                    formData.append(key, data[key]);
                }
            });

            const token = localStorage.getItem('token');

            await axios.post('http://localhost:4000/api/ads', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            alert('Объявление создано и отправлено на модерацию!');
            navigate('/');
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error || 'Неизвестная ошибка';
            alert(`Ошибка при создании объявления: ${errorMsg}`);
        }
    };

    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-white">Создать объявление</h1>
            <form className="bg-gray-800 p-8 rounded-xl" onSubmit={handleSubmit(onSubmit)}>

                <h2 className="text-xl font-semibold text-white mb-4">Основные данные</h2>

                <div className="mb-4">
                    <input
                        type="text"
                        {...register("title", { required: "Заголовок обязателен" })}
                        placeholder="Название объявления (например: Hyundai Solaris, 2020)"
                        className="w-full p-3 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                    />
                    {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Бренды */}
                    <select
                        {...register("brandId", { required: "Выберите бренд" })}
                        onChange={handleBrandChange}
                        className="p-3 rounded bg-gray-700 text-white"
                    >
                        <option value="">Выберите бренд</option>
                        {brands.length > 0 ? brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        )) : <option value="">Нет брендов (база пуста)</option>}
                    </select>
                    {errors.brandId && <p className="text-red-400 text-sm">{errors.brandId.message}</p>}

                    {/* Модели */}
                    <select
                        {...register("modelId", { required: "Выберите модель" })}
                        className="p-3 rounded bg-gray-700 text-white"
                        disabled={!selectedBrandId}
                    >
                        <option value="">Выберите модель</option>
                        {models.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>
                    {errors.modelId && <p className="text-red-400 text-sm">{errors.modelId.message}</p>}

                    {/* Цвета (Динамическая загрузка) */}
                    <select
                        {...register("colorId", { required: "Выберите цвет" })}
                        className="p-3 rounded bg-gray-700 text-white"
                    >
                        <option value="">Выберите цвет</option>
                        {colors.length > 0 ? colors.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option> // <-- Используем реальные ID из БД
                        )) : <option value="">Нет цветов (запустите seed.js)</option>}
                    </select>
                    {errors.colorId && <p className="text-red-400 text-sm">{errors.colorId.message}</p>}

                    {/* VIN */}
                    <input
                        type="text"
                        {...register("vin", {
                            required: "VIN обязателен",
                            pattern: {
                                value: /^[A-HJ-NPR-Z0-9]{17}$/i,
                                message: "Неверный формат VIN (17 символов)"
                            }
                        })}
                        placeholder="VIN номер (17 символов)"
                        className="p-3 rounded bg-gray-700 text-white"
                    />
                    {errors.vin && <p className="text-red-400 text-sm">{errors.vin.message}</p>}
                </div>

                <h2 className="text-xl font-semibold text-white mb-4">Документы и владение</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="text"
                        {...register("ptsNumber", { required: "Номер ПТС обязателен" })}
                        placeholder="ПТС номер"
                        className="p-3 rounded bg-gray-700 text-white"
                    />

                    <input
                        type="text"
                        {...register("ptsSeries")}
                        placeholder="ПТС серия (необязательно)"
                        className="p-3 rounded bg-gray-700 text-white"
                    />

                    <input
                        type="number"
                        {...register("ptsOwners", { required: "Кол-во владельцев обязательно", min: 1 })}
                        placeholder="Владельцев по ПТС"
                        className="p-3 rounded bg-gray-700 text-white"
                    />

                    <div className="col-span-2">
                        <label className="inline-flex items-center text-white">
                            <input
                                type="checkbox"
                                {...register("registered")}
                                value="true"
                                className="mr-2"
                            />
                            Автомобиль состоит на учете (с гос. номером)
                        </label>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-white mb-4">Эксплуатация</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        type="number"
                        {...register("mileage", { required: "Пробег обязателен", min: 0 })}
                        placeholder="Пробег км"
                        className="p-3 rounded bg-gray-700 text-white"
                    />

                    <select
                        {...register("state", { required: true })}
                        className="p-3 rounded bg-gray-700 text-white"
                    >
                        <option value="good">Не битый</option>
                        <option value="bad">Битый</option>
                    </select>

                    <input
                        type="number"
                        {...register("price", { required: "Цена обязательна", min: 1000 })}
                        placeholder="Цена ₽"
                        className="p-3 rounded bg-gray-700 text-white"
                    />

                    <input
                        type="number"
                        {...register("year", { required: "Год обязателен", min: 1900, max: new Date().getFullYear() + 1 })}
                        placeholder="Год выпуска"
                        className="p-3 rounded bg-gray-700 text-white"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-white mb-2">Дополнительные опции</label>
                    {['ЭУР', 'Климат-контроль', 'Подогрев', 'Кожаный салон', 'Навигация'].map((opt) => (
                        <label key={opt} className="inline-flex items-center mr-4 text-white">
                            <input
                                type="checkbox"
                                {...register("options")}
                                value={opt}
                                className="mr-1"
                            />
                            {opt}
                        </label>
                    ))}
                </div>

                <div className="mb-4">
                    <label className="block text-white mb-2">Фотографии (до 10)</label>
                    <input
                        type="file"
                        {...register("photos", {
                            validate: {
                                maxFiles: files => files.length <= 10 || "Максимум 10 файлов"
                            }
                        })}
                        multiple
                        accept="image/*"
                        className="text-white"
                    />
                    <p className="text-gray-400 text-sm mt-1">
                        Выбрано файлов: {photosWatch ? photosWatch.length : 0}
                    </p>
                </div>

                <h2 className="text-xl font-semibold text-white mb-4">Описание и контакты</h2>
                <div className="mb-4">
                    <label className="block text-white mb-2">Описание</label>
                    <textarea
                        {...register("description", { required: "Описание обязательно" })}
                        rows="4"
                        className="w-full p-3 rounded bg-gray-700 text-white"
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <input
                        type="text"
                        {...register("address", { required: "Адрес обязателен" })}
                        placeholder="Адрес осмотра"
                        className="p-3 rounded bg-gray-700 text-white"
                    />

                    <input
                        type="text"
                        {...register("contact", { required: "Контактный телефон/имя обязательно" })}
                        placeholder="Контакт"
                        className="p-3 rounded bg-gray-700 text-white"
                    />
                </div>

                <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold">
                    Создать объявление
                </button>
            </form>
        </div>
    );
}