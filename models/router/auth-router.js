const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller.js');

// POST /api/login
router.post('/login', authController.login);

// POST /api/logout (Nên dùng POST hoặc DELETE)
router.post('/logout', authController.logout);

module.exports = router;