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
        <form onSubmit={handleSubmit}>
            <label>
                <p>Email</p>
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
            </label>
            <label>
                <p>Password</p>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
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

Login.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired
};
