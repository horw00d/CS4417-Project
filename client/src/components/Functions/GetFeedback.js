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
        <div style={styles.container}>
            <h2>Feedback Chat</h2>
            {error && <p style={styles.error}>{error}</p>}
            <div style={styles.chatBox}>
                {feedbackList.map((feedback) => (
                    <div key={feedback.feedbackid} style={styles.message}>
                        <p style={styles.email}>{feedback.email}</p>
                        <p style={styles.text}>{feedback.feedback}</p>
                        <p style={styles.timestamp}>{new Date(feedback.created_at).toLocaleString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        width: '50%',
        margin: '20px auto',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    },
    chatBox: {
        maxHeight: '300px',
        overflowY: 'auto',
        padding: '10px',
        borderTop: '1px solid #ccc',
        backgroundColor: '#ffffff',
    },
    message: {
        padding: '6px',
        marginBottom: '6px',
        borderRadius: '6px',
        backgroundColor: '#e3f2fd',
        fontSize: '14px',
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.1)',
    },
    email: {
        fontWeight: 'bold',
        marginBottom: '3px',
        fontSize: '13px',
    },
    text: {
        marginBottom: '3px',
        fontSize: '12px',
    },
    timestamp: {
        fontSize: '10px',
        color: 'gray',
        textAlign: 'right',
    },
    error: {
        color: 'red',
    }
};
