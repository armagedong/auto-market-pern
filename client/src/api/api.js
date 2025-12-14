// client/src/api/api.js

import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:4000/api',
});

// 1. Функция для установки/удаления токена в заголовках axios
export const setAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete API.defaults.headers.common['Authorization'];
    }
};

// 2. Немедленная инициализация: Проверяем localStorage при загрузке модуля
const token = localStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

export default API;