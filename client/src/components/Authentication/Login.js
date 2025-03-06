import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function Login({ setIsAuthenticated }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function login(details) {
        return await fetch('http://localhost:5000/routes/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(details)
        }).then(data => data.json());
    }    

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await login({ email, password });
        if (response.success) {
            setIsAuthenticated(true);
            if (response.user.new_user) {
                setTimeout(() => {
                    navigate("/changePassword", { state: { email } });
                }, 100);
            } else {
                navigate("/landing");
            }
        } else {
            setMessage(response.message);
        }
    };
    

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input 
                        type="text" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                    Submit
                </button>
                {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
            </form>
        </div>
    );
}

Login.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired
};