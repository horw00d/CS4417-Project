const jwt = require('jsonwebtoken');
const pool = require('../database');

const checkToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) return res.status(403).json({ message: 'Token is required' });

    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Unauthorized' });

        req.user = decoded;
        next();
    });
};

const adminOnly = async (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(403).json({message: "Unauthorized"});
    }
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    const userQuery = await pool.query('SELECT role FROM users WHERE email=$1', [decoded.email]);

    if (userQuery.rows.length === 0 || userQuery.rows[0].role != "admin"){
        return res.status(403).json({message: "Access denied"});
    }

    next();
}

module.exports = { checkToken, adminOnly };
