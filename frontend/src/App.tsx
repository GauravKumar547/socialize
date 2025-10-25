import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from '@/context/AuthContext';
import { SocketProvider } from '@/context/SocketContext';
import Home from '@/pages/Home';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Messenger from '@/pages/Messenger';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Users from './pages/Users';

const App: React.FC = () => {
    const { user } = useContext(AuthContext);

    return (
        <SocketProvider>
            <div>
                <Router>
                    <Routes>
                        <Route path="/" element={user ? <Home /> : <Login />} />
                        <Route path="/profile/:username" element={<Profile />} />
                        <Route path="/users" element={user ? <Users /> : <Login />} />
                        <Route
                            path="/register"
                            element={user ? <Navigate to="/" replace /> : <Register />}
                        />
                        <Route path="/messenger" element={user ? <Messenger /> : <Login />} />
                        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
                        <Route path="/forgot-password" element={user ? <Navigate to="/" replace /> : <ForgotPassword />} />
                        <Route path="/reset-password" element={user ? <Navigate to="/" replace /> : <ResetPassword />} />
                    </Routes>
                </Router>
                <Toaster position="top-right" reverseOrder={false} />
            </div>
        </SocketProvider>
    );
};

export default App; 