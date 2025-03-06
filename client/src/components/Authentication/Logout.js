import React, { useState } from 'react';

export default function Logout() {
    const [message, setMessage] = useState("");

    async function logout() {
        try {
            const response = await fetch('http://localhost:5000/routes/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            return await response.json();
        } catch (error) {
            console.error('Logout error:', error);
            return { error: 'Network or server error' };
        }
    }

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const response = await logout();

            if (response.message === 'Logged out successfully') {
                window.location.href = "/login";
            } else {
                setMessage(response.message || "Logout failed");
            }
        } catch (error) {
            setMessage("An unexpected error occurred");
            console.error(error);
        }
    }

    return (
        <div className="flex flex-col items-center mt-4">
            <button 
                onClick={handleLogout} 
                className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-md hover:bg-gray-600 transition"
            >
                Logout
            </button>
            {message && (
                <p className="mt-2 text-red-500 text-sm">{message}</p>
            )}
        </div>
    );
}
