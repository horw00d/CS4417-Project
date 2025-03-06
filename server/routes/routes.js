const express = require('express');
const router = express.Router();
const { login, logout, changePassword } = require('../controllers/authController');
const { getUsers, register, addUser, protectedRoute } = require('../controllers/userController');
const { getFeedback, addFeedback } = require('../controllers/feedbackController');
const { checkAuth, checkRole } = require('../controllers/checkController');
const { checkToken, adminOnly } = require('../middleware/auth');

router.get('/getUsers', checkToken, adminOnly, getUsers);
router.get('/getFeedback', checkToken, getFeedback);
router.post('/login', login);
router.post('/register', register);
router.post('/addUser', checkToken, adminOnly, addUser);
router.post('/logout', checkToken, logout);
router.post('/changePassword', checkToken, changePassword);
router.post('/addFeedback', checkToken, addFeedback);
router.get('/protected', checkToken, protectedRoute);
router.get('/checkAuth', checkAuth);
router.get('/checkRole', checkRole);

module.exports = router;
