import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import CreateAd from './pages/CreateAd.jsx';
import Feed from './pages/Feed.jsx';
import { setAuthToken } from './api/api.js';
import Register from "./pages/Register.jsx";

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
                <Route path="/feed" element={<Register />} />
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/create" element={<CreateAd user={user} />} />
            </Routes>
        </Router>
    );
}

export default App;
