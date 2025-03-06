import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function ChangePassword({ setIsNewUser }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newRePassword, setNewRePassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
    }, []);

    async function changePassword(details) {
        return await fetch('http://localhost:5000/routes/changePassword', {
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
        if (newPassword !== newRePassword) {
            setMessage("Passwords do not match");
            return;
        }

        const response = await changePassword({
            email,
            password,
            newPassword
        });

        if (response.user) {
            setIsNewUser(false);
            navigate("/landing", { replace: true });
        }
        setMessage(response.message);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Change Password</h2>
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
                    <label className="block text-gray-700">Current Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Re-type New Password</label>
                    <input
                        type="password"
                        value={newRePassword}
                        onChange={e => setNewRePassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                </div>
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
                    >
                        Submit
                    </button>
                </div>
                {message && <p className="mt-4 text-red-500 text-center">{message}</p>}
            </form>
        </div>
    );
}

ChangePassword.propTypes = {
    setIsNewUser: PropTypes.func.isRequired
};
