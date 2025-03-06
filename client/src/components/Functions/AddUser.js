import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

export default function AddUser(){
    const navigate = useNavigate();
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [message, setMessage] = useState("");

    async function addUser(details){
        return await fetch('http://localhost:5000/routes/addUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        }).then(data => data.json())
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await addUser({
            username,
            email
        });
        if(response.user){
            navigate("/landing");
        }
        setMessage(response.message);
        }

    return(
        <div>
            <h3>Add User</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={e => setUsername(e.target.value)}/>
                </label>
                <label>
                    <p>Email</p>
                    <input type="text" onChange={e => setEmail(e.target.value)}/>
                </label>
                <div>
                    <button type="submit">Submit</button>
                </div>
                <div>
                    <Link to="/landing">Back</Link>
                </div>
                <div>
                    {message !== "" &&
                        <p>{message}</p>
                    }
                </div>
            </form>
        </div>
    )
}