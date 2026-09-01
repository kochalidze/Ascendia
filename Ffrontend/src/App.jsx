import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuthStore } from './store/authStore';

import NavBar from './components/NavBar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home/Home';
import UserDashboard from './pages/UserDashboard';
import Shop from './pages/Shop';
import Chat from './pages/Chat';

function App() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);

    useEffect(() => {
      checkAuth();
    }, []);

    if (isLoading) return (
      <div style={{
        minHeight: '100vh', 
        background: '#0d0b1a', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#a07aff',
        fontFamily: 'Courier New',
        letterSpacing: '2px'
      }}>
        იტვირთება...
      </div>
    );
  return (
    <div>
      
      <Routes>
        {isAuthenticated ? (
            <Route path="/" element={<Navigate to="/home" replace />} />
        ) : (
            <Route path="/" element={<Navigate to="/register" replace />} />
        )}

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<UserDashboard />} />

        <Route path="/shop" element={<Shop />} />

        <Route path="/chat" element={<Chat />} />

    </Routes>
    <NavBar />
    </div>
    
  )
}

export default App