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
        // Clear browser history so the user cannot go back
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
            setIsNewUser(false); // Mark as not a new user
            navigate("/landing", { replace: true }); // Navigate while replacing history
        }
        setMessage(response.message);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                <p>Email</p>
                <input type="text" onChange={e => setEmail(e.target.value)} />
            </label>
            <label>
                <p>Current Password</p>
                <input type="password" onChange={e => setPassword(e.target.value)} />
            </label>
            <label>
                <p>New Password</p>
                <input type="password" onChange={e => setNewPassword(e.target.value)} />
            </label>
            <label>
                <p>Re-type New Password</p>
                <input type="password" onChange={e => setNewRePassword(e.target.value)} />
            </label>
            <div>
                <button type="submit">Submit</button>
            </div>
            <div>
                {message && <p>{message}</p>}
            </div>
        </form>
    );
}

ChangePassword.propTypes = {
    setIsNewUser: PropTypes.func.isRequired
};