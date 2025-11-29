import React, { useEffect, useState } from 'react';
import API from '../api/api';
import AdCard from '../components/AdCard';

const Feed = () => {
    const [ads, setAds] = useState([]);

    useEffect(() => {
        API.get('/ads')
            .then(res => setAds(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h2 className="text-3xl font-bold mb-6">Автомобили на продаже</h2>
            {ads.length === 0 ? (
                <p className="text-gray-500">Пока нет объявлений 😢</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
                </div>
            )}
        </div>
    );
};

export default Feed;
