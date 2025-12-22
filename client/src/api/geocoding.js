// client/src/api/geocoding.js

import axios from 'axios';

// ⚠️ ЗАМЕНИТЕ ЭТО НА ВАШ РЕАЛЬНЫЙ КЛЮЧ API 2ГИС
const DG_API_KEY = '1c9b97fd-86fb-4861-a340-12600c03385b';

// Используем endpoint для геокодирования/поиска объектов
// Этот endpoint позволяет найти адрес и получить его координаты
const GEOCODING_URL = 'https://catalog.api.2gis.ru/3.0/items/geocode';


/**
 * Запрашивает предложения по вводу адреса, используя 2ГИС.
 * В отличие от Google, 2ГИС может сразу вернуть координаты в результате поиска.
 * * @param {string} query - Частично введенный адрес
 * @returns {Array} Массив объектов, содержащих адрес и координаты
 */
export const fetchAddressSuggestions = async (query) => {
    if (query.length < 3) return [];

    try {
        const response = await axios.get(GEOCODING_URL, {
            params: {
                q: query,
                key: DG_API_KEY,
                fields: 'items.point',
                page: 1,
                page_size: 10,
            }
        });

        // Обработка ответа 2ГИС
        const items = response.data.result.items || [];

        return items
            // Фильтруем только те, у которых есть координаты и адрес
            .filter(item => item.point && item.full_name)
            .map(item => ({
                // full_name - это полный, стандартизированный адрес
                address: item.full_name,
                lat: item.point.lat,
                lng: item.point.lon,
                id: item.id,
            }));

    } catch (error) {
        console.error("Ошибка при запросе геокодирования 2ГИС:", error);
        return [];
    }
};

// Функция getGeocodeDetails больше не нужна, так как координаты получаем сразу!