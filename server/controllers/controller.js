const pool = require('../database');
const mail = require('../middleware/mail');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
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

exports.getFeedback = async (req, res) => {
    try{
        const result = await pool.query('SELECT * FROM feedback;');
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
        return res.status(200).json({message: 'Login successful', user: {id: user.id, email: user.email, new_user: user.new_user}, success: true});
        

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

exports.addUser = async (req, res) => {
    try {
        const {username, email} = req.body;

        const userVerification = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userVerification.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const tempPassword = crypto.randomBytes(8).toString('hex');

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);

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
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

exports.addFeedback = async (req, res) => {
    try {
        const {feedback} = req.body;

        const token = req.cookies.token;

        if (!token) {
            return res.status(403).json({message: "Unauthorized"});
        }

        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        const email = decoded.email;

        const newFeedback = await pool.query(
            'INSERT INTO feedback (email, feedback) VALUES ($1, $2) RETURNING email, feedback;',
            [email, feedback]
        );

        res.status(201).json({ message: 'Feedback added successfully', feedback: newFeedback.rows[0] });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
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
        if (!token){
            return res.status(401).json({ role: null, error: "No token provided" });
        }
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
        const userQuery = await pool.query('SELECT role FROM users WHERE email=$1', [decoded.email]);

        if (userQuery.rows.length === 0){
            return res.status(404).json({ role: null, error: "User not found" });
        }

        return res.json({ role: userQuery.rows[0].role });

    } catch (error) {
        console.error("Error checking role:", error);
        return res.status(500).json({ role: null, error: "Server error" });
    }
};





