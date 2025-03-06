import React, { useState } from 'react';

export default function Logout() {
    const [message, setMessage] = useState("");

    async function logout() {
        try {
            const response = await fetch('http://localhost:5000/routes/logout', {
                method: 'POST',
                credentials: 'include', // Ensures cookies are included
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
                window.location.href = "/login"; // Redirect to login
            } else {
                setMessage(response.message || "Logout failed");
            }
        } catch (error) {
            setMessage("An unexpected error occurred");
            console.error(error);
        }
    }

    return (
        <div>
            <button 
                onClick={handleLogout} 
            >
                Logout
            </button>
            {message && (
                <p className="error-message">{message}</p>
            )}
        </div>
    );
}
