import React, { useState } from 'react';
import API from '../api/api';

const CreateAd = ({ user }) => {
    const [form, setForm] = useState({
        title: '', brand: '', model: '', year: '', price: '', mileage: '', fuel: '', gearbox: '', color: '', description: '', vin: ''
    });
    const [photos, setPhotos] = useState([]);
    const [preview, setPreview] = useState([]);

    const handleChange = (e) => setForm({...form, [e.target.name]: e.target.value});

    const handleFiles = (e) => {
        const files = Array.from(e.target.files);
        setPhotos(files);

        // Превью изображений
        const previews = files.map(file => URL.createObjectURL(file));
        setPreview(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        for (let key in form) data.append(key, form[key]);
        photos.forEach(file => data.append('photos', file));

        try {
            await API.post('/ads', data);
            alert('Объявление отправлено на модерацию ✅');
            setForm({
                title: '', brand: '', model: '', year: '', price: '', mileage: '', fuel: '', gearbox: '', color: '', description: '', vin: ''
            });
            setPhotos([]);
            setPreview([]);
        } catch (err) {
            alert(err.response?.data?.error || 'Ошибка');
        }
    };

    if (!user) return <p className="p-8 text-center text-gray-500">Пожалуйста, войдите, чтобы создать объявление</p>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-lg space-y-4">
                <h2 className="text-2xl font-bold mb-4">Добавить автомобиль</h2>

                {/* Поля формы */}
                {Object.keys(form).map(key => (
                    key !== 'description' ?
                        <input key={key} name={key} placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                               className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                               onChange={handleChange} value={form[key]} /> :
                        <textarea key={key} name={key} placeholder="Описание"
                                  className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onChange={handleChange} value={form[key]}></textarea>
                ))}

                {/* Загрузка фото */}
                <input type="file" multiple accept="image/*" className="w-full" onChange={handleFiles} />

                {/* Превью фото */}
                {preview.length > 0 && (
                    <div className="flex space-x-2 overflow-x-auto mt-2">
                        {preview.map((src, i) => (
                            <img key={i} src={src} alt={`preview ${i+1}`} className="h-24 w-32 object-cover rounded flex-shrink-0" />
                        ))}
                    </div>
                )}

                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-colors">Создать объявление</button>
            </form>
        </div>
    );
};

export default CreateAd;
