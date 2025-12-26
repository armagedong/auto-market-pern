import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Импортируем для расшифровки токена
import Navbar from './components/Navbar.jsx';
import Login from './pages/Login.jsx';
import CreateAd from './pages/CreateAd.jsx';
import Feed from './pages/Feed.jsx';
import { setAuthToken } from './api/api.js';
import Register from "./pages/Register.jsx";
import AdDetails from './pages/AdDetails.jsx';
import Profile from './pages/Profile.jsx';
import Footer from "./components/Footer.jsx";
import ModerationPage from "./pages/ModerationPage.jsx";
import AdminPanel from "./pages/AdminPanel.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Добавляем состояние загрузки

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Проверяем, не просрочен ли токен
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setAuthToken(token);
                    setUser(decoded); // Восстанавливаем данные пользователя (id, role, username)
                }
            } catch (error) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setAuthToken(null);
    };

    // Пока проверяем токен при загрузке, лучше ничего не рендерить, чтобы не было "прыжков" интерфейса
    if (loading) return null;

    return (
        <Router>
            <Navbar user={user} logout={logout}/>
            <div className="min-h-screen"> {/* Контейнер для корректного прижатия футера */}
                <Routes>
                    {/* ПУБЛИЧНЫЕ РОУТЫ */}
                    <Route path="/" element={<Feed user={user}/>}/>
                    <Route path="/login" element={<Login setUser={setUser}/>}/>
                    <Route path="/register" element={<Register setUser={setUser}/>}/>
                    <Route path="/ad/:id" element={<AdDetails/>}/>

                    {/* ЗАЩИЩЕННЫЕ РОУТЫ (Для всех авторизованных) */}
                    <Route path="/create" element={
                        <ProtectedRoute>
                            <CreateAd user={user}/>
                        </ProtectedRoute>
                    }/>

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile user={user}/>
                        </ProtectedRoute>
                    }/>

                    {/* АДМИНСКИЕ РОУТЫ */}
                    <Route path="/admin" element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }/>

                    <Route path="/moderation" element={
                        <ProtectedRoute adminOnly={true}>
                            <ModerationPage user={user}/>
                        </ProtectedRoute>
                    }/>
                </Routes>
            </div>
            <Footer user={user}/>
        </Router>
    );
}

export default App;