import React from 'react';
import { useForm } from 'react-hook-form';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await API.post('/auth/register', data);
            alert('Registered successfully!');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.error || 'Error');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl mb-4">Register</h2>
                <input {...register('email')} type="email" placeholder="Email" className="w-full p-2 border mb-2 rounded"/>
                <input {...register('nickname')} type="text" placeholder="Nickname" className="w-full p-2 border mb-2 rounded"/>
                <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 border mb-4 rounded"/>
                <button className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;
