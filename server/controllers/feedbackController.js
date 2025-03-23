const pool = require('../database');
const jwt = require('jsonwebtoken');
const xss = require('xss');

exports.getFeedback = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM feedback;');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving feedback', error: error.message });
    }
};

exports.addFeedback = async (req, res) => {
    try {
        const { feedback } = req.body;
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        const email = decoded.email;

        if (!feedback || feedback.trim().length === 0) {
            return res.status(400).json({ message: 'Feedback cannot be empty' });
        }

        const sanitizedFeedback = xss(feedback);

        const newFeedback = await pool.query(
            'INSERT INTO feedback (email, feedback) VALUES ($1, $2) RETURNING email, feedback;',
            [email, sanitizedFeedback]
        );

        res.status(201).json({ message: 'Feedback added successfully', feedback: newFeedback.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
