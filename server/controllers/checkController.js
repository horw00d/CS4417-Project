const pool = require('../database');
const jwt = require('jsonwebtoken');

exports.checkAuth = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json({ authenticated: false });
        }

        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

        const userQuery = await pool.query('SELECT * FROM users WHERE email=$1', [decoded.email]);
        if (userQuery.rows.length === 0) {
            return res.json({ authenticated: false });
        }

        const user = userQuery.rows[0];

        return res.json({ authenticated: true, new_user: user.new_user });

    } catch (error) {
        return res.json({ authenticated: false });
    }
};

exports.checkRole = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ role: null, error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        const userQuery = await pool.query('SELECT role FROM users WHERE email=$1', [decoded.email]);

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ role: null, error: 'User not found' });
        }

        return res.json({ role: userQuery.rows[0].role });
    } catch (error) {
        res.status(500).json({ role: null, error: 'Server error' });
    }
};
