const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
    if (!header) return res.status(403).json({ message: 'Token is required' });

    const token = header.split(' ')[1];
    jwt.verify(token, process.env.PRIVATE_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Unauthorized' });

        req.user = decoded;
        next();
    });
};

module.exports = checkToken;
