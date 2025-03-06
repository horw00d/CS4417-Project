const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validatePassword } = require('../utils/validators');
require('dotenv').config();

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userQuery = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const user = userQuery.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.PRIVATE_KEY, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });

        return res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email, new_user: user.new_user }, success: true });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.logout = (req, res) => {
    try {
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0)
        });

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error during logout', error: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { email, password, newPassword } = req.body;

        const userQuery = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (userQuery.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const user = userQuery.rows[0];

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const { isValid, errors } = validatePassword(newPassword);
        if (!isValid) {
            return res.status(400).json({ message: 'Password did not meet requirements', errors });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        const updatedUser = await pool.query(
            'UPDATE users SET password_hash=$1, new_user=false WHERE email=$2 RETURNING id, email;',
            [hashedPassword, email]
        );

        return res.status(200).json({ message: 'Password changed successfully', user: updatedUser.rows[0] });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error from here', error: error.message });
    }
};
