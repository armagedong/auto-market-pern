import React from 'react';
import { useForm } from 'react-hook-form';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    // Включаем валидацию email и password
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    /**
     * @summary Обрабатывает отправку формы регистрации.
     * @param {Object} data - Валидированные данные формы.
     */
    const onSubmit = async (data) => {
        try {
            await API.post('/auth/register', data);
            alert('Регистрация прошла успешно! Теперь войдите в систему.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Ошибка при регистрации');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 p-8 rounded-xl w-96 shadow-lg">
                <h2 className="text-2xl mb-4 text-white">Регистрация</h2>

                {/* Email */}
                <input
                    {...register('email', {
                        required: "Email обязателен",
                        pattern: { value: /^\S+@\S+$/i, message: "Неверный формат email" }
                    })}
                    type="email"
                    placeholder="Email"
                    className="w-full p-3 rounded mb-2 bg-gray-700 text-white"
                />
                {errors.email && <p className="text-red-400 text-sm mb-2">{errors.email.message}</p>}

                {/* Username */}
                <input
                    {...register('username', { required: "Имя пользователя обязательно" })} // <-- username вместо nickname
                    type="text"
                    placeholder="Имя пользователя"
                    className="w-full p-3 rounded mb-2 bg-gray-700 text-white"
                />
                {errors.username && <p className="text-red-400 text-sm mb-2">{errors.username.message}</p>}

                {/* Password */}
                <input
                    {...register('password', { required: "Пароль обязателен", minLength: { value: 6, message: "Минимум 6 символов" } })}
                    type="password"
                    placeholder="Пароль"
                    className="w-full p-3 rounded mb-4 bg-gray-700 text-white"
                />
                {errors.password && <p className="text-red-400 text-sm mb-4">{errors.password.message}</p>}

                <button className="w-full p-3 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold">Зарегистрироваться</button>
            </form>
        </div>
    );
};

export default Register;