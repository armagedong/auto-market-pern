import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
            <Navbar user={user} logout={logout}/>
            <Routes>
                <Route path="/" element={<Feed user={user}/>}/>
                <Route path="/login" element={<Login setUser={setUser}/>}/>
                <Route path="/register" element={<Register setUser={setUser}/>}/>
                <Route path="/create" element={<CreateAd user={user}/>}/>
                <Route path="/ad/:id" element={<AdDetails/>}/>
                <Route path="/profile" element={<Profile user={user}/>}/>
                <Route path="/moderation" element={<ModerationPage user={user}/>}/>
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute adminOnly={true}>
                            <AdminPanel />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <Footer user={user}/>

        </Router>

    );
}

export default App;