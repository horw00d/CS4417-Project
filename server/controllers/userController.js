const pool = require('../database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mail = require('../middleware/mail');
const jwt = require('jsonwebtoken');
const { validateUsername, validateEmail } = require('../utils/validators');

exports.getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users;');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

exports.addUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        const usernameValidation = validateUsername(username);
        if (!usernameValidation.isValid) {
            return res.status(400).json({ message: "Incorrect username format", error: usernameValidation.error });
        }

        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            return res.status(400).json({ message: "Incorrect email format", error: emailValidation.error });
        }

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
