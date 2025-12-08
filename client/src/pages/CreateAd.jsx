import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateAd({ user }) {
    const navigate = useNavigate();

    const [brands, setBrands] = useState([]);
    const [models, setModels] = useState([]);
    const [colors, setColors] = useState([
        'Красный', 'Синий', 'Черный', 'Белый', 'Серый', 'Зеленый'
    ]);
    const [form, setForm] = useState({
        brand_id: '',
        model_id: '',
        color: '',
        vin: '',
        govNumber: '',
        ptcNumber: '',
        ptcSeries: '',
        owners: 1,
        mileage: '',
        condition: 'good',
        price: '',
        address: '',
        contacts: '',
        options: [],
        description: '',
        photos: []
    });

    useEffect(() => {
        if (!user) {
            alert('Вы должны войти в систему');
            navigate('/login');
            return;
        }
        fetchBrands();
    }, [user]);

    const fetchBrands = async () => {
        const res = await axios.get('http://localhost:4000/api/brands');
        setBrands(res.data);
    };

    const fetchModels = async (brand_id) => {
        const res = await axios.get(`http://localhost:4000/api/models?brand_id=${brand_id}`);
        setModels(res.data);
    };

    const handleBrandChange = (e) => {
        const brand_id = e.target.value;
        setForm({ ...form, brand_id, model_id: '' });
        fetchModels(brand_id);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setForm((prev) => {
                const newOptions = checked
                    ? [...prev.options, value]
                    : prev.options.filter((opt) => opt !== value);
                return { ...prev, options: newOptions };
            });
        } else if (name === 'photos') {
            setForm({ ...form, photos: Array.from(e.target.files) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Вы должны войти в систему');
            return;
        }

        try {
            const data = new FormData();
            Object.keys(form).forEach((key) => {
                if (key === 'photos') {
                    form.photos.forEach((file) => data.append('photos', file));
                } else if (key === 'options') {
                    form.options.forEach((opt) => data.append('options', opt));
                } else {
                    data.append(key, form[key]);
                }
            });

            const token = localStorage.getItem('token');

            await axios.post('http://localhost:4000/api/ads', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`   // <- добавили токен
                }
            });

            alert('Объявление создано и отправлено на модерацию!');
            navigate('/');
        } catch (err) {
            console.error(err);
            alert('Ошибка при создании объявления');
        }
    };


    return (
        <div className="p-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-white">Создать объявление</h1>
            <form className="bg-gray-800 p-8 rounded-xl" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <select
                        name="brand_id"
                        value={form.brand_id}
                        onChange={handleBrandChange}
                        className="p-3 rounded bg-gray-700 text-white"
                        required
                    >
                        <option value="">Выберите бренд</option>
                        {brands.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>

                    <select
                        name="model_id"
                        value={form.model_id}
                        onChange={handleChange}
                        className="p-3 rounded bg-gray-700 text-white"
                        required
                    >
                        <option value="">Выберите модель</option>
                        {models.map((m) => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                    </select>

                    <select
                        name="color"
                        value={form.color}
                        onChange={handleChange}
                        className="p-3 rounded bg-gray-700 text-white"
                        required
                    >
                        <option value="">Выберите цвет</option>
                        {colors.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="vin"
                        value={form.vin}
                        onChange={handleChange}
                        placeholder="VIN номер"
                        className="p-3 rounded bg-gray-700 text-white"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="text" name="govNumber" value={form.govNumber} onChange={handleChange} placeholder="Гос. номер" className="p-3 rounded bg-gray-700 text-white"/>
                    <input type="text" name="ptcNumber" value={form.ptcNumber} onChange={handleChange} placeholder="ПТС номер" className="p-3 rounded bg-gray-700 text-white"/>
                    <input type="text" name="ptcSeries" value={form.ptcSeries} onChange={handleChange} placeholder="ПТС серия" className="p-3 rounded bg-gray-700 text-white"/>
                    <input type="number" name="owners" value={form.owners} onChange={handleChange} placeholder="Владельцев по ПТС" className="p-3 rounded bg-gray-700 text-white"/>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="number" name="mileage" value={form.mileage} onChange={handleChange} placeholder="Пробег км" className="p-3 rounded bg-gray-700 text-white"/>
                    <select name="condition" value={form.condition} onChange={handleChange} className="p-3 rounded bg-gray-700 text-white">
                        <option value="good">Не битый</option>
                        <option value="bad">Битый</option>
                    </select>
                    <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Цена ₽" className="p-3 rounded bg-gray-700 text-white"/>
                    <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Адрес" className="p-3 rounded bg-gray-700 text-white"/>
                </div>

                <div className="mb-4">
                    <label className="block text-white mb-2">Дополнительные опции</label>
                    {['ЭУР', 'Климат-контроль', 'Подогрев', 'Кодер'].map((opt) => (
                        <label key={opt} className="inline-flex items-center mr-4 text-white">
                            <input type="checkbox" name="options" value={opt} onChange={handleChange} className="mr-1"/>
                            {opt}
                        </label>
                    ))}
                </div>

                <div className="mb-4">
                    <label className="block text-white mb-2">Описание</label>
                    <textarea name="description" value={form.description} onChange={handleChange} rows="4" className="w-full p-3 rounded bg-gray-700 text-white"></textarea>
                </div>

                <div className="mb-4">
                    <label className="block text-white mb-2">Фотографии (до 10)</label>
                    <input type="file" name="photos" multiple accept="image/*" onChange={handleChange} className="text-white"/>
                </div>

                <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold">
                    Создать объявление
                </button>
            </form>
        </div>
    );
}
