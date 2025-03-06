import React, { useEffect, useState } from 'react';
import Logout from '../Authentication/Logout';
import AddFeedback from '../Functions/AddFeedback';
import GetFeedback from '../Functions/GetFeedback';
import { Link } from 'react-router-dom';

export default function Landing() {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/routes/protected', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                setMessage(data.message);
            } else {
                setError('Failed to access protected route.');
            }
        })
        .catch(error => {
            setError('Error fetching protected route.');
            console.error(error);
        });
    }, []);    

    return (
        <div>
            <h2>Landing Page</h2>
            <GetFeedback/>
            <AddFeedback/>
            {message && <p>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <Logout />
            <div>
                <Link to="/changePassword">Change Password</Link>
            </div>
            <div>
                <Link to="/admin">Admin Page</Link>
            </div>
        </div>
    );
}
