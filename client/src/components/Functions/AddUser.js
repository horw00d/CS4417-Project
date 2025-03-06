import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddUser() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    async function addUser(details) {
        return await fetch('http://localhost:5000/routes/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        }).then(data => data.json());
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await addUser({ username, email });

        if (response.user) {
            navigate("/landing");
        }

        setMessage(response.message);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-semibold text-center mb-4">Add User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Username</label>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block font-medium">Email</label>
                    <input 
                        type="text" 
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className="flex">
                    <button 
                        type="submit" 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition">
                        Submit
                    </button>
                </div>
                {message && <p className="text-center text-red-500 mt-2">{message}</p>}
            </form>
        </div>
    );
}
