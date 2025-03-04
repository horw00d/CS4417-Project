const pool = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//function inspired by: https://www.geeksforgeeks.org/javascript-program-to-validate-password-using-regular-expressions/
function validatePassword(password){
    const minLength = 8;
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/;

    let errors = [];

    if(password.length < minLength){
        errors.push("Password must be at least 8 characters long.")
    }
    if (!uppercaseRegex.test(password)) {
        errors.push("Password must contain at least one uppercase letter.");
    }
    if (!lowercaseRegex.test(password)) {
        errors.push("Password must contain at least one lowercase letter.");
    }
    if (!numberRegex.test(password)) {
        errors.push("Password must contain at least one number.");
    }
    if (!specialCharacterRegex.test(password)) {
        errors.push("Password must contain at least one special character.");
    }

    return {
        isValid: errors.length == 0,
        errors
    }
}

exports.getUsers = async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM users;');
        res.json(result.rows);
    }
    catch (error){
        console.error('Error executing query', error);
    }
}

exports.login = async (req, res) => {
    try{
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

        //JWT implementation inspired by: https://medium.com/@maison.moa/using-jwt-json-web-tokens-to-authorize-users-and-protect-api-routes-3e04a1453c3e
        const token = jwt.sign({id: user.id, email: user.email}, process.env.PRIVATE_KEY, {expiresIn: '1h'});

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
        return res.status(200).json({message: 'Login successful', user: {id: user.id, email: user.email}, token});
        

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.logout = (req, res) => {
    try {
        // Clear the token cookie
        res.cookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0)
        });

        return res.status(200).json({ 
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ 
            message: 'Error during logout', 
            error: error.message 
        });
    }
};

exports.register = async (req, res) => {
    try {
        const {username, email, password} = req.body;

        const userVerification = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userVerification.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const { isValid, errors } = validatePassword(password);
        if (!isValid) {
            return res.status(400).json({ message: 'Password did not meet requirements', errors });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, email;',
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser.rows[0] });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


exports.changePassword = async (req, res) => {
    try {
        const { email, password, newPassword } = req.body;

        const userQuery = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
        if (userQuery.rows.length == 0) {
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
            'UPDATE users SET password_hash=$1 WHERE email=$2 RETURNING id, email;',
            [hashedPassword, email]
        );

        return res.status(200).json({ message: 'Password changed successfully', user: updatedUser.rows[0] });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.protectedRoute = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

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



