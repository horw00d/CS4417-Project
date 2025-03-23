import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Admin from './components/Admin/Admin';
import Landing from './components/Landing/Landing';
import Login from './components/Authentication/Login';
import AddUser from './components/Functions/AddUser';
import AddFeeback from './components/Functions/AddFeedback';
import GetFeedback from './components/Functions/GetFeedback';
import ChangePassword from './components/Functions/ChangePassword';
import GetUsers from './components/Functions/GetUsers';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        async function fetchAuthData() {
            try {
                const authResponse = await fetch('http://localhost:5000/routes/checkAuth', {
                    method: 'GET',
                    credentials: 'include'
                });
                const authData = await authResponse.json();
                setIsAuthenticated(authData.authenticated);
                setIsNewUser(authData.new_user);

                if (authData.authenticated) {
                    const roleResponse = await fetch('http://localhost:5000/routes/checkRole', {
                        method: 'GET',
                        credentials: 'include'
                    });
                    const roleData = await roleResponse.json();
                    setUserRole(roleData.role);
                }
            } catch (error) {
                console.error('Error fetching authentication data:', error);
                setIsAuthenticated(false);
                setIsNewUser(false);
                setUserRole(null);
            } finally {
                setLoading(false);
            }
        }

        fetchAuthData();
    }, [location.pathname]);

    if (loading) {
        return <p className="text-center text-gray-600">Loading...</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-center py-4 bg-blue-500 text-white">CS4417 Project</h1>
            <Routes>
                {!isAuthenticated ? (
                    <>
                        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </>
                ) : isNewUser ? (
                    <>
                        <Route path="/changePassword" element={<ChangePassword setIsNewUser={setIsNewUser} />} />
                        <Route path="*" element={<Navigate to="/changePassword" />} />
                    </>
                ) : (
                    <>
                        <Route path="/landing" element={<Landing />} />
                        <Route path="/changePassword" element={<ChangePassword setIsNewUser={setIsNewUser} />} />
                        {userRole === 'admin' && <Route path="/admin" element={<Admin />} />}
                        {userRole === 'admin' && <Route path="/addUser" element={<AddUser />} />}
                        {userRole === 'admin' && <Route path="/getUsers" element={<GetUsers />} />}
                        <Route path="/addFeedback" element={<AddFeeback />} />
                        <Route path="/getFeedback" element={<GetFeedback />} />
                        <Route path="*" element={<Navigate to="/landing" />} />
                    </>
                )}
            </Routes>
        </div>
    );
}

export default App;