const express = require('express');
const router = express.Router();
const {getUsers, login, register, changePassword, protectedRoute} = require('../controllers/controller');

router.get('/query', getUsers);
router.post('/login', login);
router.post('/register', register);
router.post('/changePassword', changePassword)
router.get('/protected', protectedRoute)

module.exports = router;