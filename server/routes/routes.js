const express = require('express');
const router = express.Router();
const {getUsers, login, register, logout, changePassword, protectedRoute} = require('../controllers/controller');
const checkToken = require('../middleware/auth');

router.get('/query', getUsers);
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.post('/changePassword', changePassword)
router.get('/protected', checkToken, protectedRoute)

module.exports = router;