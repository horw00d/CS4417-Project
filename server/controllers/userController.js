const pool = require('../database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mail = require('../middleware/mail');
const jwt = require('jsonwebtoken');
const { validatePassword } = require('../utils/validators');

exports.getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users;');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userVerification = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userVerification.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const { isValid, errors } = validatePassword(password);
        if (!isValid) {
            return res.status(400).json({ message: 'Password did not meet requirements', errors });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email;',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { username, email } = req.body;
        const userVerification = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userVerification.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const tempPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email;',
            [username, email, hashedPassword]
        );

        mail(email, tempPassword);
        res.status(201).json({ message: 'User added successfully', user: newUser.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.protectedRoute = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({ message: 'Token is required' });
        }

        //JWT implementation inspired by: https://medium.com/@maison.moa/using-jwt-json-web-tokens-to-authorize-users-and-protect-api-routes-3e04a1453c3e
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);

        return res.status(200).json({ message: 'Protected content from server', user: decoded });

    } catch (error) {
        return res.status(403).json({ message: 'Unauthorized', error: error.message });
    }
};
