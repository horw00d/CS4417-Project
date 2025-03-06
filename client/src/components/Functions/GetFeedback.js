import React, { useEffect, useState } from 'react';

export default function GetFeedback() {
    const [feedbackList, setFeedbackList] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/routes/getFeedback', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => setFeedbackList(data))
        .catch(error => {
            console.error("Error fetching feedback:", error);
            setError("Failed to fetch feedback.");
        });
    }, []);

    return (
        <div className="w-100 mx-auto p-4 border rounded-lg bg-gray-100 shadow-md">
            <h2 className="text-lg font-semibold text-center mb-4">Feedback Chat</h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="max-h-80 overflow-y-auto p-2 border-t bg-white rounded-md">
                {feedbackList.map((feedback) => (
                    <div key={feedback.feedbackid} className="p-3 mb-3 rounded-lg bg-blue-100 text-sm shadow-sm">
                        <p className="font-bold text-xs mb-1">{feedback.email}</p>
                        <p className="text-sm mb-1">{feedback.feedback}</p>
                        <p className="text-xs text-gray-500 text-right">{new Date(feedback.created_at).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
