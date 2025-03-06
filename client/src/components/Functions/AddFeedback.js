import React, {useState} from 'react';

export default function AddFeedback(){
    const [feedback, setFeedback] = useState();
    const [message, setMessage] = useState("");

    async function addFeedback(details){
        return await fetch('http://localhost:5000/routes/addFeedback', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        }).then(data => data.json())
    }

    const handleSubmit = async e => {
        e.preventDefault();
        const response = await addFeedback({
            feedback
        });
        setMessage(response.message || "Feedback submitted successfully");
        }

    return(
        <form onSubmit={handleSubmit}>
            <label>
                <p>Feedback</p>
                <input type="text" onChange={e => setFeedback(e.target.value)}/>
            </label>
            <div>
                <button type="submit">Submit Feedback</button>
            </div>
            <div>
                {message !== "" &&
                    <p>{message}</p>
                }
            </div>
        </form>
    )
}