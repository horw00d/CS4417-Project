import React, { useState } from 'react';

export default function AddFeedback() {
    const [feedback, setFeedback] = useState("");
    const [message, setMessage] = useState("");

    async function addFeedback(details) {
        return await fetch('http://localhost:5000/routes/addFeedback', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(details)
        }).then(data => data.json());
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await addFeedback({ feedback });
        setMessage(response.message || "Feedback submitted successfully");
        setFeedback("");
    };

    return (
        <div className="w-100 mx-auto p-4 border rounded-lg bg-gray-100 shadow-md">
            <h2 className="text-lg font-semibold text-center mb-4">Submit Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Feedback</label>
                    <input 
                        type="text" 
                        value={feedback} 
                        onChange={(e) => setFeedback(e.target.value)} 
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                        placeholder="Enter your feedback..."
                    />
                </div>
                <button 
                    type="submit" 
                    className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Submit Feedback
                </button>
                {message && <p className="text-center text-green-600 font-medium">{message}</p>}
            </form>
        </div>
    );
}