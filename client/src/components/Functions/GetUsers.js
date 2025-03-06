import React, { useEffect, useState } from 'react';

export default function GetUsers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/routes/getUsers', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setUsers(data))
        .catch(error => {
            console.error("Error fetching users:", error);
            setError("Failed to fetch users.");
        });
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-center mb-4">User List</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="max-h-80 overflow-y-auto border border-gray-300 rounded-md">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="p-2">ID</th>
                            <th className="p-2">Username</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Role</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-100">
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-gray-300">
                                <td className="p-2">{user.id}</td>
                                <td className="p-2">{user.username}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
