import React, { useEffect, useState } from 'react';

export default function UserTable() {
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
        <div style={styles.container}>
            <h2>User List</h2>
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: '60%',
        margin: '20px auto',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
    },
    tableWrapper: {
        maxHeight: '300px',
        overflowY: 'auto',
        borderRadius: '8px',
        border: '1px solid #ddd',
        backgroundColor: '#ffffff',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        backgroundColor: '#e3f2fd',
        padding: '8px',
        borderBottom: '1px solid #ccc',
        fontWeight: 'bold',
    },
    td: {
        padding: '6px',
        borderBottom: '1px solid #eee',
    },
    error: {
        color: 'red',
    }
};
