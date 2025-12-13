import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import CreateAd from './pages/CreateAd.jsx';
import Feed from './pages/Feed.jsx';
import { setAuthToken } from './api/api.js';
import Register from "./pages/Register.jsx";
import AdDetails from './pages/AdDetails.jsx';

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setAuthToken(token);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setAuthToken(null);
    };

    return (
        <Router>
            <Navbar user={user} logout={logout} />
            <Routes>
                <Route path="/" element={<Feed />} />
                {/* <Route path="/feed" element={<Register />} /> <-- УДАЛЕНО: Дубликат и ошибка */}
                <Route path="/login" element={<Login setUser={setUser} />} />
                {/* <Route path="/register" element={<Register setUser={setUser} />} /> <-- УДАЛЕНО: Register не принимает setUser */}
                <Route path="/register" element={<Register />} />
                <Route path="/create" element={<CreateAd user={user} />} />
                <Route path="/ad/:id" element={<AdDetails />} />

            </Routes>
        </Router>
    );
}

export default App;